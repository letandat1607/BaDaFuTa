const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../../../.env") });
const { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat, HashAlgorithm } = require("vnpay");
const { v4 } = require("uuid");
const axios = require("axios");
const { publishMsg } = require('../rabbitMQ/rabbitFunction');

async function paymentMomo(payload) {
    console.log("Da do momo")
    // const { orderID, totalAmount } = req.body;
    var partnerCode = "MOMO";
    var accessKey = "F8BBA842ECF85";
    var secretkey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    var requestId = partnerCode + new Date().getTime();
    var orderId = payload.order_id + new Date().getTime();
    var orderInfo = `pay ${payload.order_id}`;
    var redirectUrl = `https://unrecurring-kieran-savagely.ngrok-free.dev/checkPaymentMomo`;
    var ipnUrl = `https://unrecurring-kieran-savagely.ngrok-free.dev/checkPaymentMomo`;
    // var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
    var amount = `${payload.total_amount}`;
    var requestType = "payWithMethod";
    const extraDataObj = {
        userId: payload.user_id,
        merchantId: payload.merchant_id
    };
    const extraData = Buffer.from(JSON.stringify(extraDataObj)).toString('base64');

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType
    //puts raw signature
    console.log("--------------------RAW SIGNATURE----------------")
    console.log(rawSignature)
    //signature
    const crypto = require('crypto');
    var signature = crypto.createHmac('sha256', secretkey)
        .update(rawSignature)
        .digest('hex');
    console.log("--------------------SIGNATURE----------------")
    console.log(signature)

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        accessKey: accessKey,
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        extraData: extraData,
        requestType: requestType,
        signature: signature,
        lang: 'en'
    });

    const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    // return res.status(200).json({ payUrl: response.data.payUrl });


    publishMsg({ orderId, payUrl: response.data.payUrl, userId: payload.user_id }, "payment_exchange", "payment.gateway.payment_qr")
    return response.data.payUrl;
}

const paymentVNPay = async (req, res) => {
    try {
        const id = v4();
        const vnpay = new VNPay({
            tmnCode: 'LG6JN9GU',
            secureSecret: 'AEKXXS7HN1DLSEAIY0KFE1137M4TVKLK',
            vnpayHost: 'https://sandbox.vnpayment.vn',
            // tmnCode: process.env.vnp_TmnCode,
            // secureSecret: process.env.vnp_HashSecret,
            testMode: true,
            hashAlgorithm: 'SHA512',
            loggerFn: ignoreLogger
        });

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const vnpayResponse = await vnpay.buildPaymentUrl({
            vnp_Amount: 50000,//tổng giá tiền
            vnp_IpAddr: '127.0.0.1',
            // vnp_IpAddr: '172.20.10.4',
            vnp_TxRef: id, //orderID
            vnp_OrderInfo: `id ${id}`, //orderID
            vnp_OrderType: ProductCode.Other,
            vnp_ReturnUrl: 'http://localhost:3004/api/checkVnpay',
            vnp_Locale: VnpLocale.VN,
            vnp_CreateDate: dateFormat(new Date()),
            vnp_ExpireDate: dateFormat(tomorrow)
        })
        console.log(vnpayResponse);
        return res.status(201).json(vnpayResponse);
    } catch (err) {
        console.log("có lỗi: ", err)
    }

}

module.exports.handlePayment = async (payload) => {
    // const { method } = req.body;

    switch (payload.method) {
        case "MOMO":
            return paymentMomo(payload);
        case "vnpay":
        // return paymentVNPay(req, res);
        //   case "cod":
        // return paymentCod(req, res);
        default:
            // return res.status(400).json({ error: "Unsupported payment method" });
            throw new Error("Unsupported payment method");
    }
};

module.exports.checkPaymentMomo = async (data, extraDataBase64) => {
    
    let userId = null;
    let merchantId = null
    if (extraDataBase64) {
        const decoded = Buffer.from(extraDataBase64, 'base64').toString('utf-8');
        const extra = JSON.parse(decoded);
        userId = extra.userId;
        merchantId = extra.merchantId;
    }

    console.log("userID: ", userId);
    console.log("merchantID: ", merchantId);

    if (data.resultCode === "0") {
        const orderPayment = {
            userId,
            merchantId,
            statusPayment: "paid",
            orderId: data.orderId
        };
        await publishMsg(orderPayment, "payment_exchange", "payment.order.completed")
    } else {
        const orderPayment = {
            userId,
            merchantId,
            statusPayment: "failed",
            orderId: data.orderId
        };
        await publishMsg(orderPayment, "payment_exchange", "payment.order.failed");
    }

    return data;
};
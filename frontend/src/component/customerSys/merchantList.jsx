// src/pages/RestaurantList.jsx
import { useState, useEffect } from "react";
import RestaurantCard from "./commonCustomer/card";
import LoadingSkeleton from "./commonCustomer/loadingSkeleton";
import { Text, Callout, Theme } from "@radix-ui/themes";

export default function MerchantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    fetch(`${baseURL}/api/merchant/getAllMerchant`)
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải danh sách");
        return res.json();
      })
      .then((data) => setRestaurants(data.restaurants || data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Theme>
      <div className="container mx-auto p-6">
        {loading && <LoadingSkeleton />}

        {error && (
          <Callout color="red" className="mb-6" role="alert">
            Lỗi: {error}
          </Callout>
        )}

        {!loading && !error && restaurants.length === 0 && (
          <Text align="center" color="gray">
            Không có nhà hàng nào.
          </Text>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-cy="restaurant-grid">
          {restaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      </div>

    </Theme>
  );
}
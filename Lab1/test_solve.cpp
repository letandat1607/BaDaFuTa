#include <iostream>
#include <cmath>
#include <vector>
using namespace std;

int solveQuartic(double a, double b, double c, double x[]) {
    if (a == 0 && b == 0 && c == 0) return -1;
    if (a == 0 && b == 0) return 0;

    if (a == 0) {
        double y = -c / b;
        if (y < 0) return 0;
        x[0] = sqrt(y);
        x[1] = -sqrt(y);
        return 2;
    }

    double delta = b * b - 4 * a * c;
    if (delta < 0) return 0;

    double y1 = (-b + sqrt(delta)) / (2 * a);
    double y2 = (-b - sqrt(delta)) / (2 * a);

    int count = 0;
    if (y1 >= 0) {
        x[count++] = sqrt(y1);
        x[count++] = -sqrt(y1);
    }
    if (y2 >= 0 && y2 != y1) {
        x[count++] = sqrt(y2);
        x[count++] = -sqrt(y2);
    }
    return count;
}

struct TestCase {
    double a, b, c;
    int expectedCount; // số nghiệm kỳ vọng (-1 = vô số nghiệm)
};

int main() {
    vector<TestCase> tests = {
        {0, 0, 0, -1},   // Case 1: vô số nghiệm
        {0, 0, 7, 0},    // Case 2: vô nghiệm
        {0, 4, 12, 0},   // Case 3: bậc nhất, nghiệm âm
        {0, 5, -20, 2},  // Case 4: bậc nhất, nghiệm dương
        {2, 0, 3, 0},    // Case 5: bậc hai, Δ < 0
        {1, -6, 9, 2},   // Case 6: bậc hai, Δ = 0, nghiệm y dương
        {1, -9, 20, 4},  // Case 7: bậc hai, Δ > 0, 2 nghiệm y dương
        {1, 2, -15, 2}   // Case 8: bậc hai, Δ > 0, 1 nghiệm âm, 1 nghiệm dương
    };

    for (size_t i = 0; i < tests.size(); i++) {
        double x[4];
        int result = solveQuartic(tests[i].a, tests[i].b, tests[i].c, x);
        if (result == tests[i].expectedCount) {
            cout << "Test case " << i + 1 << " passed." << endl;
        } else {
            cout << "Test case " << i + 1 << " FAILED: expected "
                 << tests[i].expectedCount << " but got " << result << endl;
        }
    }
    return 0;
}

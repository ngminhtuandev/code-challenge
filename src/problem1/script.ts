// Problem #1

/**
 * Calculates the sum of integers from 1 to n using a for loop.
 *
 * @param {number} n - The upper limit integer for the summation.
 * @returns {number} The sum of integers from 1 to n.
 *
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
var sum_to_n_a = function (n: number): number {
    let sum: number = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

/**
 * Calculates the sum of integers from 1 to n using recursion.
 *
 * @param {number} n - The upper limit integer for the summation.
 * @returns {number} The sum of integers from 1 to n.
 *
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 */
var sum_to_n_b = function (n: number): number {
    if (n === 1) {
        return 1;
    }
    return n + sum_to_n_b(n - 1);
};

/**
 * Calculates the sum of integers from 1 to n using the mathematical formula for an arithmetic series.
 *
 * @param {number} n - The upper limit integer for the summation.
 * @returns {number} The sum of integers from 1 to n.
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 */
var sum_to_n_c = function (n: number): number {
    return n * (n + 1) / 2;
};

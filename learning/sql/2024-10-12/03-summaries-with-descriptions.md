### Tutorial: Finding Sales per Product Grouped by Year/Month and Merging with Product Descriptions in SQL

In this tutorial, you’ll learn how to query two related tables to find the total number of sales for each product in a given year and month, and how to merge the results with product descriptions. We will use two tables:

- `sales`: Contains sales data with columns like `sales_date` and `product_key`.
- `product`: Contains product details with columns like `product_key` and `product_description`.

### Problem Overview

The goal is to:

- Find the total number of sales for each product in each year/month combination.
- Group the results by product and by the year/month combination.
- Merge the product descriptions from the `product` table to make the report more readable.

### Step 1: Understanding the Tables

Let's assume the tables have the following structure:

#### `sales` Table:

| sales_date | product_key |
| ---------- | ----------- |
| 2023-01-05 | 101         |
| 2023-01-10 | 102         |
| 2023-02-15 | 101         |
| 2023-02-20 | 103         |

#### `product` Table:

| product_key | product_description |
| ----------- | ------------------- |
| 101         | Apple               |
| 102         | Banana              |
| 103         | Orange              |

### Step 2: Extracting the Year and Month from `sales_date`

SQL provides functions like `YEAR()` and `MONTH()` to extract the year and month from a date. We will use these functions to group the sales data by year and month.

### Step 3: Joining the `sales` and `product` Tables

To combine the sales data with product descriptions, we will use an SQL `JOIN`. We will join the `sales` table with the `product` table on the `product_key` column, which is present in both tables.

### Step 4: Counting the Total Sales

Once the tables are joined and the date components are extracted, we will use the `COUNT()` function to calculate the total number of sales for each product in the specified year/month combination.

### Step 5: Writing the SQL Query

Here is the SQL query that accomplishes all of the above steps:

```sql
SELECT
    p.product_description,
    YEAR(s.sales_date) AS sales_year,
    MONTH(s.sales_date) AS sales_month,
    COUNT(s.product_key) AS total_sales
FROM
    sales s
JOIN
    product p
ON
    s.product_key = p.product_key
GROUP BY
    p.product_description,
    YEAR(s.sales_date),
    MONTH(s.sales_date)
ORDER BY
    sales_year, sales_month, p.product_description;
```

### Explanation:

1. **`SELECT` Clause**:

   - `p.product_description`: Retrieves the description of the product.
   - `YEAR(s.sales_date)` and `MONTH(s.sales_date)`: Extract the year and month from the `sales_date` column in the `sales` table.
   - `COUNT(s.product_key)`: Counts the number of sales for each product in each year/month combination.

2. **`FROM` Clause**:

   - This specifies the `sales` table (`s`) as the main source of data.

3. **`JOIN` Clause**:

   - `JOIN product p ON s.product_key = p.product_key`: Joins the `sales` table (`s`) with the `product` table (`p`) on the common `product_key` column.

4. **`GROUP BY` Clause**:

   - `GROUP BY p.product_description, YEAR(s.sales_date), MONTH(s.sales_date)`: Groups the results by product description, year, and month to calculate the total sales for each combination.

5. **`ORDER BY` Clause**:
   - `ORDER BY sales_year, sales_month, p.product_description`: Orders the final output by year, month, and product description to make it easier to read.

### Step 6: Filtering by a Specific Year/Month (Optional)

If you are interested in filtering the results for a specific year or month, you can add a `WHERE` clause. For example, to retrieve sales for January 2023 only:

```sql
SELECT
    p.product_description,
    YEAR(s.sales_date) AS sales_year,
    MONTH(s.sales_date) AS sales_month,
    COUNT(s.product_key) AS total_sales
FROM
    sales s
JOIN
    product p
ON
    s.product_key = p.product_key
WHERE
    YEAR(s.sales_date) = 2023
    AND MONTH(s.sales_date) = 1
GROUP BY
    p.product_description,
    YEAR(s.sales_date),
    MONTH(s.sales_date)
ORDER BY
    sales_year, sales_month, p.product_description;
```

### Step 7: Interpreting the Results

After running the query, you will receive an output like this:

| product_description | sales_year | sales_month | total_sales |
| ------------------- | ---------- | ----------- | ----------- |
| Apple               | 2023       | 01          | 150         |
| Banana              | 2023       | 01          | 200         |
| Orange              | 2023       | 02          | 180         |
| Apple               | 2023       | 02          | 170         |

In this example:

- `150` sales were made for `Apple` in January 2023.
- `200` sales were made for `Banana` in January 2023.
- `170` sales were made for `Apple` in February 2023.

### Step 8: Conclusion

By following this tutorial, you have learned how to:

- Extract the year and month from a date in SQL.
- Join two tables to combine related data.
- Group the results by product and date to count the total sales.
- Order the final results for readability.

This type of query is especially useful for generating reports and summaries of sales data. You can easily modify the query to filter for specific products, dates, or other conditions as needed.

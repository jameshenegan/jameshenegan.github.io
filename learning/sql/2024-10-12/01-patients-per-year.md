## Tutorial: Analyzing Doctor and Patient Data Using SQL

### Scenario

You have a table called **`patients`** in a database that logs each patient's visit to a hospital. This table has the following relevant columns:

- **`doctor_id`**: The unique identifier for the doctor who saw the patient.
- **`date_of_visit`**: The date when the patient visited the doctor.

You want to generate meaningful insights and analysis from this data, such as:

- The number of patients each doctor sees per year.
- The year-over-year percentage increase in patients for each doctor.
- Interesting trends and anomalies in the data.

### 1. Counting Patients Seen Per Doctor Per Year

First, you want to know how many patients each doctor saw each year. Here's the basic SQL query to achieve that:

```sql
SELECT
    doctor_id,
    YEAR(date_of_visit) AS year,
    COUNT(*) AS num_patients_seen_in_year
FROM
    patients
GROUP BY
    doctor_id, YEAR(date_of_visit)
ORDER BY
    doctor_id, year;
```

#### Explanation:

- `COUNT(*)`: Counts the number of rows (patients) for each combination of `doctor_id` and year.
- `GROUP BY doctor_id, YEAR(date_of_visit)`: Groups the data by `doctor_id` and the year extracted from `date_of_visit`.
- `ORDER BY doctor_id, year`: Ensures the results are ordered by `doctor_id` and year.

This query provides you with a breakdown of how many patients each doctor has seen each year.

### 2. Adding Year-over-Year Percentage Increase

To calculate the **percentage increase** in the number of patients for each doctor year-over-year, you can use the `LAG()` window function. This will allow you to access the number of patients seen in the previous year for each doctor.

Here’s the query that computes the year-over-year percentage increase:

```sql
WITH patients_per_year AS (
    SELECT
        doctor_id,
        YEAR(date_of_visit) AS year,
        COUNT(*) AS num_patients_seen_in_year
    FROM
        patients
    GROUP BY
        doctor_id, YEAR(date_of_visit)
)
SELECT
    doctor_id,
    year,
    num_patients_seen_in_year,
    CASE
        WHEN LAG(num_patients_seen_in_year) OVER (PARTITION BY doctor_id ORDER BY year) IS NULL THEN NULL
        ELSE (num_patients_seen_in_year - LAG(num_patients_seen_in_year) OVER (PARTITION BY doctor_id ORDER BY year)) / LAG(num_patients_seen_in_year) OVER (PARTITION BY doctor_id ORDER BY year)
    END AS percent_increase
FROM
    patients_per_year
ORDER BY
    doctor_id, year;
```

#### Explanation:

- **`LAG()`**: This window function retrieves the number of patients seen in the previous year for each doctor.
- **`CASE WHEN ... THEN NULL`**: If there's no previous year (for the first year of data), return `NULL`. Otherwise, calculate the percentage increase using the formula:
  - \[(current_year_patients - previous_year_patients) / previous_year_patients\]
- **`PARTITION BY doctor_id ORDER BY year`**: Ensures the window function operates separately for each doctor and is ordered by year.

This query will give you the number of patients seen by each doctor in each year, along with the percentage increase in patients for subsequent years.

### 3. Exploring Interesting Questions with SQL

Now that you have the basic queries, you can extend the analysis to answer more complex questions:

#### a. Which Doctor Saw the Most Patients in a Given Year?

```sql
SELECT doctor_id, year, num_patients_seen_in_year
FROM (
    SELECT
        doctor_id,
        YEAR(date_of_visit) AS year,
        COUNT(*) AS num_patients_seen_in_year,
        RANK() OVER (PARTITION BY YEAR(date_of_visit) ORDER BY COUNT(*) DESC) AS rank
    FROM
        patients
    GROUP BY
        doctor_id, YEAR(date_of_visit)
) AS ranked_patients
WHERE rank = 1;
```

This query uses `RANK()` to rank doctors by the number of patients they saw in each year and then filters for the doctor with the highest patient count.

#### b. Which Doctor Had the Largest Percentage Increase in Patients?

```sql
WITH percentage_increase AS (
    WITH patients_per_year AS (
        SELECT
            doctor_id,
            YEAR(date_of_visit) AS year,
            COUNT(*) AS num_patients_seen_in_year
        FROM
            patients
        GROUP BY
            doctor_id, YEAR(date_of_visit)
    )
    SELECT
        doctor_id,
        year,
        num_patients_seen_in_year,
        CASE
            WHEN LAG(num_patients_seen_in_year) OVER (PARTITION BY doctor_id ORDER BY year) IS NULL THEN NULL
            ELSE (num_patients_seen_in_year - LAG(num_patients_seen_in_year) OVER (PARTITION BY doctor_id ORDER BY year)) / LAG(num_patients_seen_in_year) OVER (PARTITION BY doctor_id ORDER BY year)
        END AS percent_increase
    FROM
        patients_per_year
)
SELECT doctor_id, year, percent_increase
FROM percentage_increase
WHERE percent_increase IS NOT NULL
ORDER BY percent_increase DESC
LIMIT 1;
```

This query calculates the percentage increase for each doctor and then retrieves the record with the highest percentage increase.

#### c. Which Doctor Had the Most Consistent Growth?

You can measure consistent growth by checking which doctor has had positive percentage increases over multiple years:

```sql
WITH consistent_growth AS (
    WITH patients_per_year AS (
        SELECT
            doctor_id,
            YEAR(date_of_visit) AS year,
            COUNT(*) AS num_patients_seen_in_year
        FROM
            patients
        GROUP BY
            doctor_id, YEAR(date_of_visit)
    )
    SELECT
        doctor_id,
        year,
        num_patients_seen_in_year,
        CASE
            WHEN LAG(num_patients_seen_in_year) OVER (PARTITION BY doctor_id ORDER BY year) IS NULL THEN NULL
            ELSE (num_patients_seen_in_year - LAG(num_patients_seen_in_year) OVER (PARTITION BY doctor_id ORDER BY year)) / LAG(num_patients_seen_in_year) OVER (PARTITION BY doctor_id ORDER BY year)
        END AS percent_increase
    FROM
        patients_per_year
)
SELECT doctor_id, COUNT(*) AS years_of_growth
FROM consistent_growth
WHERE percent_increase > 0
GROUP BY doctor_id
ORDER BY years_of_growth DESC
LIMIT 1;
```

This query finds the doctor with the highest number of years where they had a positive percentage increase in patient load.

### 4. Visualizing the Data

Once you've analyzed the data with SQL, you can visualize it using tools like Python, Excel, or BI platforms (like Tableau or Power BI). For example:

- **Line charts**: To show trends in the number of patients over time for each doctor.
- **Bar charts**: To compare the number of patients seen by different doctors each year.
- **Heatmaps**: To highlight doctors with the highest percentage increases or anomalies in their data.

### Conclusion

In this tutorial, we’ve covered:

1. How to count the number of patients each doctor sees per year.
2. How to calculate the year-over-year percentage increase for each doctor.
3. Some complex and interesting questions you can answer using SQL, like finding which doctor had the most consistent growth or the largest percentage increase in patients.

This type of analysis helps hospitals make data-driven decisions about doctor performance, patient distribution, and capacity planning. By extending these concepts, you can explore a wide variety of business problems and gain valuable insights from your data.

### Tutorial: Longitudinal Data Analysis with Binary Outcomes Using GEE and Mixed-Effects Logistic Regression

In this tutorial, we will guide you through analyzing longitudinal data where the outcome is binary (e.g., whether the percent increase in patients is greater than 4.5% or not) using two powerful methods: **Generalized Estimating Equations (GEE)** and **Mixed-Effects Logistic Regression**. We will also cover how to adjust for the baseline patient load (the number of patients seen in the first year) to control for initial differences between doctors.

#### Scenario

You have a dataset that tracks the number of patients each doctor sees over several years. The goal is to understand the probability that a doctor experiences a **greater than 4.5% increase** in patient load from year to year. However, doctors may start with different numbers of patients, so we want to adjust for the **baseline number of patients seen in the first year** to account for these differences.

### Step 1: Preparing the Data

Start by organizing your data into a structure that includes:

1. **doctor_id**: Unique identifier for each doctor.
2. **year**: The year of the visit.
3. **num_patients_seen_in_year**: The number of patients seen by the doctor in that year.
4. **percent_increase**: The percentage increase in patients compared to the previous year.
5. **increase_over_4_5_percent_binary**: A binary indicator (1/0) where `1` means the percent increase was greater than 4.5%, and `0` means it was not.
6. **patients_first_year**: The number of patients seen by the doctor in their first year.

To calculate the **percent increase** and binary indicator, use SQL or a similar approach. Here’s an SQL example to compute these columns:

```sql
WITH patients_per_year AS (
    SELECT
        doctor_id,
        YEAR(date_of_visit) AS year,
        COUNT(*) AS num_patients_seen_in_year
    FROM
        patients
    GROUP BY
        doctor_id, YEAR(date_of_visit)
)
SELECT
    doctor_id,
    year,
    num_patients_seen_in_year,
    CASE
        WHEN LAG(num_patients_seen_in_year) OVER (PARTITION BY doctor_id ORDER BY year) IS NULL THEN NULL
        ELSE (num_patients_seen_in_year - LAG(num_patients_seen_in_year) OVER (PARTITION BY doctor_id ORDER BY year)) / LAG(num_patients_seen_in_year) OVER (PARTITION BY doctor_id ORDER BY year)
    END AS percent_increase,
    CASE
        WHEN (LAG(num_patients_seen_in_year) OVER (PARTITION BY doctor_id ORDER BY year) IS NOT NULL AND
              (num_patients_seen_in_year - LAG(num_patients_seen_in_year) OVER (PARTITION BY doctor_id ORDER BY year)) / LAG(num_patients_seen_in_year) OVER (PARTITION BY doctor_id ORDER BY year) > 0.045)
        THEN 1
        ELSE 0
    END AS increase_over_4_5_percent_binary
FROM
    patients_per_year
ORDER BY
    doctor_id, year;
```

Now that your data is ready, let's move on to the analysis.

---

### Step 2: Analyzing with GEE (Generalized Estimating Equations)

GEE is used to model population-averaged effects in longitudinal data, accounting for the correlation between repeated measures for the same subject (in this case, doctors).

#### Fitting a GEE Model

In R, we can fit the model using the `geepack` library. Here’s how you can fit a GEE model with a binary outcome (whether the doctor had a >4.5% increase) and adjust for the number of patients in the first year.

```r
# Install the geepack package if you haven't already
# install.packages("geepack")

library(geepack)

gee_model <- geeglm(
  increase_over_4_5_percent_binary ~ year + patients_first_year,
  family = binomial,
  id = doctor_id,
  data = your_data,
  corstr = "exchangeable"
)

summary(gee_model)
```

#### Interpreting the GEE Results

- **Intercept**: The baseline log-odds that a doctor will exceed a 4.5% increase, holding `year` and `patients_first_year` constant.
- **Year**: A positive coefficient for `year` suggests that, over time, the odds of exceeding a 4.5% increase are increasing.
- **Patients_First_Year**: A negative coefficient indicates that doctors with a higher patient load in the first year are less likely to exceed a 4.5% increase in subsequent years.

You can convert the coefficients from log-odds to **odds ratios** for easier interpretation:

```r
odds_ratio <- exp(gee_model$coefficients)
```

---

### Step 3: Analyzing with Mixed-Effects Logistic Regression

Mixed-Effects Logistic Regression allows you to account for **individual variability** between doctors. It models **random intercepts** for each doctor, which helps capture doctor-specific baseline probabilities.

#### Fitting a Mixed-Effects Model

In R, you can use the `lme4` package to fit a mixed-effects logistic regression:

```r
# Install the lme4 package if you haven't already
# install.packages("lme4")

library(lme4)

mixed_model <- glmer(
  increase_over_4_5_percent_binary ~ year + patients_first_year + (1 | doctor_id),
  family = binomial,
  data = your_data
)

summary(mixed_model)
```

#### Interpreting the Mixed-Effects Model Results

- **Fixed Effects**: Similar to GEE, the fixed effects (`year`, `patients_first_year`) represent population-averaged effects.

  - A positive coefficient for `year` means that the odds of exceeding a 4.5% increase grow over time.
  - A negative coefficient for `patients_first_year` means that doctors who saw more patients in their first year are less likely to experience large increases in subsequent years.

- **Random Effects (Intercept)**: The random intercept represents the variability in baseline odds of exceeding a 4.5% increase across doctors. A higher variance suggests that doctors differ significantly in their likelihood of exceeding this threshold, even after accounting for the fixed effects.

---

### Step 4: Comparing the Models

- **GEE**: This model gives you **population-averaged effects**, which is useful if you’re interested in how the overall population of doctors behaves over time.
- **Mixed-Effects Logistic Regression**: This model is ideal for understanding **doctor-specific effects**, allowing you to account for variability between individual doctors.

#### Key Questions to Ask When Interpreting Results:

1. **Does the likelihood of exceeding a 4.5% increase in patient load change over time?**
   - Check the coefficient for `year`. A positive value indicates that doctors are more likely to exceed this threshold in later years.
2. **How does the baseline patient load (patients_first_year) affect future increases?**

   - A negative coefficient for `patients_first_year` suggests that starting with more patients reduces the likelihood of large increases in future years.

3. **How much variability is there between doctors?**
   - In the mixed-effects model, check the **random intercept variance**. Higher variability means that some doctors consistently see larger (or smaller) percentage increases than others.

---

### Step 5: Reporting and Next Steps

Once you’ve run and interpreted your models, you can report the results:

1. **Model Fit**: Use metrics like **QIC** for GEE or **AIC** for the mixed-effects model to assess the goodness-of-fit. Lower values indicate better model fit.
2. **Odds Ratios**: Convert your log-odds estimates to **odds ratios** for easier interpretation.
3. **Adjusting Models**: Consider adding interaction terms, such as `year * patients_first_year`, to explore how the effect of the first-year patient load changes over time.

### Conclusion

In this tutorial, we walked through how to use **GEE** and **Mixed-Effects Logistic Regression** to analyze binary outcomes in longitudinal data. Both models account for the correlation between repeated measurements, but mixed-effects models provide additional insights into doctor-specific variability. Adjusting for baseline variables, like the number of patients seen in the first year, helps control for initial differences and ensures more accurate inferences about growth trends.

By applying these models, you can uncover valuable insights into how doctors' patient loads evolve over time and identify factors that influence growth trajectories.

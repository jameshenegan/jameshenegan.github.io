# SQL Queries

## Example 1

### Assumed Table Structure:

1. **Doctor table**:
   - `Doctor_ID`: A unique identifier for each doctor.
   - `Doctor_Name`: Name of the doctor (optional).
2. **Patient table**:
   - `Patient_ID`: A unique identifier for each patient.
   - `Doctor_ID`: Foreign key that links the patient to their primary doctor.
   - `Registration_Date`: The date when the patient was registered or treated.

### Goal:

The query should show the number of patients each doctor registered or treated in each year. The result should be like this:

| Doctor_ID | Year | Num_Patients_Registered |
| --------- | ---- | ----------------------- |
| 1         | 2018 | 34                      |
| 1         | 2019 | 40                      |
| 1         | 2020 | 42                      |
| 2         | 2018 | 10                      |
| 2         | 2019 | 12                      |
| 2         | 2020 | 14                      |

### SQL Query:

```sql
SELECT
    d.Doctor_ID,
    YEAR(p.Registration_Date) AS Year,
    COUNT(p.Patient_ID) AS Num_Patients_Registered
FROM
    Doctor d
JOIN
    Patient p ON d.Doctor_ID = p.Doctor_ID
GROUP BY
    d.Doctor_ID, YEAR(p.Registration_Date)
ORDER BY
    d.Doctor_ID, Year;
```

### Explanation:

- **`JOIN`**: We join the `Doctor` table with the `Patient` table on `Doctor_ID`, linking doctors to their registered patients.
- **`YEAR(p.Registration_Date)`**: Extracts the year from the `Registration_Date`, allowing us to group patient counts by year.
- **`COUNT(p.Patient_ID)`**: Counts the number of patients registered by each doctor in each year.
- **`GROUP BY d.Doctor_ID, YEAR(p.Registration_Date)`**: Groups the result by `Doctor_ID` and the year of patient registration.
- **`ORDER BY d.Doctor_ID, Year`**: Orders the result by doctor and year.

This will output a similar table to your original request but now reflecting the number of patients registered or treated by each doctor per year:

| Doctor_ID | Year | Num_Patients_Registered |
| --------- | ---- | ----------------------- |
| 1         | 2018 | 34                      |
| 1         | 2019 | 40                      |
| 1         | 2020 | 42                      |
| 2         | 2018 | 10                      |
| 2         | 2019 | 12                      |
| 2         | 2020 | 14                      |

This assumes that each patient is linked to a doctor and has a `Registration_Date` in the `Patient` table.

## Example 2

### Problem:

You have two tables in a database:

1. **Account Table**:

   - `Account_ID`: A unique identifier for each account.
   - `Account_Start_Date`: The date when the account was opened.

2. **Transactions Table**:
   - `Transaction_ID`: A unique identifier for each transaction.
   - `Transaction_Date`: The date when the transaction occurred.
   - `Account_ID`: Foreign key that links the transaction to its account.
   - `Transaction_Amount`: The amount of the transaction.

You want to create a query that produces a result like this:

| Account_ID | Days_Since_Account_Start_Date | Transaction_ID | Transaction_Amount |
| ---------- | ----------------------------- | -------------- | ------------------ |
| 1          | 0                             | 1              | 30                 |
| 1          | 30                            | 2              | 28                 |
| 1          | 60                            | 3              | 31                 |
| 2          | 15                            | 4              | 40                 |
| 2          | 30                            | 5              | 41                 |
| 2          | 45                            | 6              | 45                 |

The goal is to calculate how many days have passed since the account started for each transaction.

### Step-by-Step Solution:

#### 1. **Understand the Relationship Between the Tables**:

- The **Account** table stores information about when each account was created (`Account_Start_Date`).
- The **Transactions** table stores each transaction's date and the corresponding account ID.

To solve this problem, we need to compute the number of days between the `Account_Start_Date` and each `Transaction_Date` for each account.

#### 2. **Use SQL's `DATEDIFF` Function**:

The SQL `DATEDIFF()` function calculates the difference between two dates. We can use it to find the number of days between the `Transaction_Date` and the `Account_Start_Date`.

#### 3. **Join the Two Tables**:

Since we need data from both the **Account** and **Transactions** tables, we’ll use a `JOIN` to combine them. We can join on the `Account_ID`, which is present in both tables.

#### 4. **Write the SQL Query**:

Here’s the query that will generate the desired result:

```sql
SELECT
    acc.Account_ID,
    DATEDIFF(t.Transaction_Date, acc.Account_Start_Date) AS Days_Since_Account_Start_Date,
    t.Transaction_ID,
    t.Transaction_Amount
FROM
    Account acc
JOIN
    Transactions t ON acc.Account_ID = t.Account_ID
ORDER BY
    acc.Account_ID, t.Transaction_Date;
```

#### 5. **Explanation of the Query**:

- **`SELECT`**: Specifies the columns we want to retrieve.
  - `acc.Account_ID`: The account ID for each transaction.
  - `DATEDIFF(t.Transaction_Date, acc.Account_Start_Date) AS Days_Since_Account_Start_Date`: Computes the number of days between the `Transaction_Date` and the `Account_Start_Date` using `DATEDIFF()`. This column is labeled `Days_Since_Account_Start_Date`.
  - `t.Transaction_ID`: The unique ID of each transaction.
  - `t.Transaction_Amount`: The amount of each transaction.
- **`FROM Account acc`**: Specifies that we are pulling data from the **Account** table, using the alias `acc` for easier reference.

- **`JOIN Transactions t ON acc.Account_ID = t.Account_ID`**: Joins the **Account** and **Transactions** tables on the `Account_ID` field. This links each transaction to its respective account.

- **`ORDER BY acc.Account_ID, t.Transaction_Date`**: Orders the results by `Account_ID` first, and then by `Transaction_Date` to show the transactions in chronological order for each account.

#### 6. **Result**:

This query will output a table where:

- Each `Transaction_ID` is listed with its `Account_ID`.
- The `Days_Since_Account_Start_Date` shows how many days passed between the account creation and the transaction.
- The `Transaction_Amount` gives the amount for each transaction.

Here’s an example of the expected result:

| Account_ID | Days_Since_Account_Start_Date | Transaction_ID | Transaction_Amount |
| ---------- | ----------------------------- | -------------- | ------------------ |
| 1          | 0                             | 1              | 30                 |
| 1          | 30                            | 2              | 28                 |
| 1          | 60                            | 3              | 31                 |
| 2          | 15                            | 4              | 40                 |
| 2          | 30                            | 5              | 41                 |
| 2          | 45                            | 6              | 45                 |

### Conclusion:

This query demonstrates how you can combine tables and use date calculations to answer business questions. In this case, the query calculates the number of days between an account's start date and each transaction for that account. With the use of `JOIN` and `DATEDIFF`, we can efficiently compute this in SQL.

## Example 3

### Problem:

You have a table called **Account** with a column named `Account_Status`, which can take on values such as `'active'`, `'pending'`, and `'terminated'`. You want to create a new column that indicates whether the account is terminated. The goal is to display a `1` if the account is terminated and `0` otherwise.

### Solution:

We can use SQL’s `CASE` statement to conditionally create this new column in a query. The `CASE` statement allows us to add simple if-else logic in SQL.

### Step-by-Step Guide:

#### 1. **Understand the Structure of the Table**:

Let's assume the **Account** table has the following columns:

- `Account_ID`: A unique identifier for each account.
- `Account_Status`: Contains the status of the account, which could be `'active'`, `'pending'`, or `'terminated'`.

Here’s an example of how the **Account** table might look:

| Account_ID | Account_Status |
| ---------- | -------------- |
| 1          | active         |
| 2          | terminated     |
| 3          | pending        |

#### 2. **Use a `CASE` Statement to Create the Flag**:

The `CASE` statement in SQL works like an if-else clause. You can use it to check the value of `Account_Status` and assign either a `1` or `0` based on whether the account is terminated.

Here’s how to write the SQL query:

```sql
SELECT
    Account_ID,
    Account_Status,
    CASE
        WHEN Account_Status = 'terminated' THEN 1
        ELSE 0
    END AS Is_Terminated
FROM
    Account;
```

#### 3. **Explanation of the SQL Query**:

- **`SELECT`**: Specifies the columns to retrieve. We include:
  - `Account_ID`: The unique ID for each account.
  - `Account_Status`: The current status of the account (active, pending, or terminated).
  - The `CASE` statement, which creates a new column, `Is_Terminated`.
- **`CASE WHEN`**: The `CASE` statement checks the value of `Account_Status`.

  - If `Account_Status = 'terminated'`, it returns `1`.
  - Otherwise (for statuses like `'active'` or `'pending'`), it returns `0`.

- **`AS Is_Terminated`**: This gives the new column a meaningful name, `Is_Terminated`.

- **`FROM Account`**: Specifies the table we are querying from (in this case, the **Account** table).

#### 4. **Result of the Query**:

When you run this query, you’ll get a result where each account is flagged with a `1` if it is terminated, and a `0` otherwise:

| Account_ID | Account_Status | Is_Terminated |
| ---------- | -------------- | ------------- |
| 1          | active         | 0             |
| 2          | terminated     | 1             |
| 3          | pending        | 0             |

This is a dynamic result, meaning it only exists when you run the query, and the `Is_Terminated` column is not saved in the table permanently.

---

### Making the Column Permanent:

If you want to add this flag as a permanent column in your table, you’ll need to take the following steps:

#### 1. **Add the New Column**:

First, you need to add a new column to your table, called `Is_Terminated`, that will store the `1` or `0`.

```sql
ALTER TABLE Account ADD Is_Terminated INT;
```

This adds a new integer column called `Is_Terminated` to the **Account** table.

#### 2. **Update the New Column Using `CASE`**:

Next, use the `CASE` logic to populate the `Is_Terminated` column based on the value of `Account_Status`:

```sql
UPDATE Account
SET Is_Terminated = CASE
    WHEN Account_Status = 'terminated' THEN 1
    ELSE 0
END;
```

This updates the new `Is_Terminated` column with a `1` for accounts that are terminated and a `0` for all other accounts.

#### 3. **Verify the Result**:

You can now check if the `Is_Terminated` column has been updated properly by running a simple `SELECT` query:

```sql
SELECT
    Account_ID,
    Account_Status,
    Is_Terminated
FROM
    Account;
```

You should now see a result like this:

| Account_ID | Account_Status | Is_Terminated |
| ---------- | -------------- | ------------- |
| 1          | active         | 0             |
| 2          | terminated     | 1             |
| 3          | pending        | 0             |

---

### Conclusion:

In this tutorial, you’ve learned how to use SQL’s `CASE` statement to create a new column that flags whether an account is terminated. You also learned how to permanently add this logic to an existing table by creating and updating a new column. The `CASE` statement is a powerful tool that allows you to apply conditional logic directly in SQL queries, making it easy to add flags or computed columns to your queries.

## Example 4

### Problem:

You have a table with information about customer accounts, including when the account was created and its current status. You want to prepare this data for survival analysis, where account termination is the event of interest. The goal is to create a table with the following columns:

- `account_id`: A unique identifier for each account.
- `days_since_account_was_created`: The number of days each account has been active.
- `account_terminated`: A binary column indicating whether the account has been terminated (`1` for terminated, `0` for active or other statuses).

### Example Desired Output:

| account_id | days_since_account_was_created | account_terminated |
| ---------- | ------------------------------ | ------------------ |
| 1          | 500                            | 1                  |
| 2          | 450                            | 0                  |
| 3          | 460                            | 0                  |
| 4          | 700                            | 1                  |
| 5          | 812                            | 0                  |
| 6          | 45                             | 0                  |

In this table:

- **days_since_account_was_created**: Represents the time each account has been active, measured in days.
- **account_terminated**: A binary indicator showing whether the account has been terminated (`1`) or if it is still active/other status (`0`).

### Step-by-Step Guide to Create the Table:

#### 1. **Understand the Structure of the Table**:

Assume you have the following table named **Accounts**, with the following columns:

- `account_id`: A unique identifier for each account.
- `account_status`: The status of the account, which can be `'active'`, `'pending'`, or `'terminated'`.
- `account_start_date`: The date when the account was created.

#### Example of the **Accounts** Table:

| account_id | account_status | account_start_date |
| ---------- | -------------- | ------------------ |
| 1          | terminated     | 2022-05-01         |
| 2          | active         | 2022-07-15         |
| 3          | pending        | 2022-07-10         |
| 4          | terminated     | 2021-10-01         |
| 5          | active         | 2021-05-01         |
| 6          | active         | 2023-09-01         |

#### 2. **Calculate Days Since the Account Was Created**:

To calculate the number of days each account has been active, you can use the SQL function `DATEDIFF()`. This function computes the difference between two dates. In this case, you’ll calculate the difference between the current date (`CURDATE()`) and the `account_start_date`.

#### 3. **Identify Terminated Accounts**:

You also need to flag whether the account has been terminated. Using a `CASE` statement, you can check if the `account_status` is `'terminated'` and return `1` for terminated accounts, and `0` for accounts that are still active or pending.

### SQL Query:

Here is the SQL query that produces the survival analysis table:

```sql
SELECT
    account_id,
    DATEDIFF(CURDATE(), account_start_date) AS days_since_account_was_created,
    CASE
        WHEN account_status = 'terminated' THEN 1
        ELSE 0
    END AS account_terminated
FROM
    Accounts;
```

### Explanation of the SQL Query:

- **`SELECT`**: This defines the columns you want in your result.
  - `account_id`: The unique ID of each account.
  - `DATEDIFF(CURDATE(), account_start_date) AS days_since_account_was_created`: This calculates the number of days between the current date (`CURDATE()`) and the `account_start_date`, representing how long the account has been active.
  - `CASE WHEN account_status = 'terminated' THEN 1 ELSE 0 END AS account_terminated`: This creates a new column `account_terminated` that flags whether the account is terminated (`1`) or not (`0`).
- **`FROM Accounts`**: This specifies the table from which you’re pulling the data.

#### 4. **Run the Query**:

When you run the query on your table, it calculates the time each account has been active and flags whether the account was terminated. The result is a table that’s ready for survival analysis.

### Example Output:

| account_id | days_since_account_was_created | account_terminated |
| ---------- | ------------------------------ | ------------------ |
| 1          | 500                            | 1                  |
| 2          | 450                            | 0                  |
| 3          | 460                            | 0                  |
| 4          | 700                            | 1                  |
| 5          | 812                            | 0                  |
| 6          | 45                             | 0                  |

### Explanation of the Result:

- **days_since_account_was_created**: This column represents how long each account has been active, calculated by subtracting the `account_start_date` from the current date.
- **account_terminated**: This binary column indicates whether the account has been terminated (`1` if terminated, `0` otherwise).

### Conclusion:

In this tutorial, you learned how to prepare data for survival analysis by calculating how many days each account has been active and whether it has been terminated. Using SQL’s `DATEDIFF()` and `CASE` statements, you can transform raw data into a structure suitable for analyzing the time until an event (in this case, account termination).

Yes, several Python packages are available for performing survival analysis. These packages provide a variety of methods to estimate survival functions, model time-to-event data, and assess covariate effects. Below are some of the most popular ones:

### 1. **Lifelines**

- **Description**: `Lifelines` is one of the most popular and user-friendly libraries for survival analysis in Python. It supports various methods such as Kaplan-Meier estimators, Cox proportional hazards models, and parametric models like the Weibull model.
- **Installation**: You can install `Lifelines` via pip:
  ```bash
  pip install lifelines
  ```
- **Key Features**:

  - **Kaplan-Meier** estimation.
  - **Cox proportional hazards** model.
  - **Nelson-Aalen** estimator (for cumulative hazard function).
  - **Parametric models**: Weibull, Exponential, Log-Normal, etc.
  - Handling of **right-censored** data.
  - Easy plotting of survival curves.
  - Ability to test proportional hazards assumptions.

- **Example**:

  ```python
  from lifelines import KaplanMeierFitter

  # Example data
  durations = [5, 6, 6, 2.5, 4, 4]  # Survival times
  event_observed = [1, 0, 1, 1, 1, 0]  # 1: Event occurred, 0: Censored

  kmf = KaplanMeierFitter()
  kmf.fit(durations, event_observed)

  # Plot survival function
  kmf.plot_survival_function()
  ```

- **Documentation**: [Lifelines Documentation](https://lifelines.readthedocs.io/en/latest/)

### 2. **Scikit-Survival**

- **Description**: `Scikit-Survival` is built on top of `scikit-learn` and provides tools to incorporate machine learning with survival analysis. It focuses on survival regression models using machine learning techniques like Support Vector Machines (SVMs) and random survival forests.
- **Installation**:
  ```bash
  pip install scikit-survival
  ```
- **Key Features**:

  - Survival analysis with **Support Vector Machines (SVMs)**.
  - **Random survival forests**.
  - **Cox proportional hazards** model.
  - Integration with the `scikit-learn` API for easy use in machine learning pipelines.
  - Tools for evaluating time-dependent predictions (e.g., Concordance Index).

- **Example**:

  ```python
  from sksurv.linear_model import CoxPHSurvivalAnalysis
  from sksurv.datasets import load_whas500
  from sksurv.util import Surv

  # Load example dataset
  data_x, data_y = load_whas500()

  # Fit a Cox Proportional Hazards model
  coxph = CoxPHSurvivalAnalysis()
  coxph.fit(data_x, data_y)

  # Make predictions
  predictions = coxph.predict(data_x)
  ```

- **Documentation**: [Scikit-Survival Documentation](https://scikit-survival.readthedocs.io/en/stable/)

### 3. **Statsmodels**

- **Description**: `Statsmodels` is a statistical modeling library that also provides some survival analysis functionality, particularly through the **Cox proportional hazards model**. However, it's more limited compared to `Lifelines` in terms of dedicated survival analysis tools.
- **Installation**:
  ```bash
  pip install statsmodels
  ```
- **Key Features**:

  - **Cox proportional hazards** model.
  - Tools for **parametric survival analysis** (Weibull, Exponential models).
  - Generalized Linear Models (GLM) and Time Series analysis support.

- **Example**:

  ```python
  import statsmodels.api as sm
  from statsmodels.duration.hazard_regression import PHReg

  # Example data
  data = sm.datasets.get_rdataset("flchain", "survival").data

  # Fit a Cox model
  model = PHReg.from_formula('futime ~ age + sex', data, status=data['death'])
  result = model.fit()
  print(result.summary())
  ```

- **Documentation**: [Statsmodels Survival Analysis Documentation](https://www.statsmodels.org/stable/duration.html)

### 4. **PySurvival**

- **Description**: `PySurvival` is a Python library that focuses on predictive modeling for survival analysis. It supports traditional models like the Cox proportional hazards model, as well as machine learning models like Gradient Boosted Survival Trees (GBST).
- **Installation**:
  ```bash
  pip install py-survival
  ```
- **Key Features**:

  - **Cox proportional hazards** model.
  - Machine learning methods like **Gradient Boosted Survival Trees**.
  - Time-varying covariates support.
  - Evaluation metrics like the **Concordance Index**, **Brier score**, and **ROC curves**.

- **Example**:

  ```python
  from pysurvival.models.survival_forest import RandomSurvivalForestModel
  from pysurvival.utils import load_data

  # Load example dataset
  data = load_data('bmt')

  # Fit Random Survival Forest Model
  rsf = RandomSurvivalForestModel(num_trees=100)
  rsf.fit(X=data['X'], T=data['T'], E=data['E'])

  # Plot survival curves
  rsf.plot_tree()
  ```

- **Documentation**: [PySurvival Documentation](https://square.github.io/pysurvival/)

### 5. **Survival Analysis in `TensorFlow` and `PyTorch` (Deep Learning)**

- **TensorFlow**: Using `TensorFlow` or `Keras`, you can build deep learning models for survival analysis such as DeepSurv, a neural network for predicting the risk of an event.
  - There’s no dedicated TensorFlow survival package, but `DeepSurv` is implemented on top of TensorFlow/Keras.
- **PyTorch**: `PyTorch` is used for building neural network-based survival analysis models, including implementations of DeepSurv.

- **DeepSurv Example** in Keras:

  ```python
  from keras.models import Sequential
  from keras.layers import Dense

  # Define a simple deep learning model for survival analysis
  model = Sequential()
  model.add(Dense(32, activation='relu', input_dim=input_shape))
  model.add(Dense(1, activation='linear'))

  # Compile model with Cox Proportional Hazards loss function
  model.compile(optimizer='adam', loss='coxph_loss')

  # Fit the model
  model.fit(X_train, y_train, epochs=10)
  ```

### Summary of Common Python Packages for Survival Analysis:

| **Package**            | **Main Methods**                                   | **Best for**                        |
| ---------------------- | -------------------------------------------------- | ----------------------------------- |
| **Lifelines**          | Kaplan-Meier, Cox PH, Parametric models            | General survival analysis           |
| **Scikit-Survival**    | Cox PH, Random Forest, SVM-based survival          | Machine learning with survival data |
| **Statsmodels**        | Cox PH, Parametric models                          | Traditional statistical methods     |
| **PySurvival**         | Cox PH, Gradient Boosting, Time-varying covariates | Predictive modeling with ML         |
| **TensorFlow/PyTorch** | DeepSurv, Custom neural networks                   | Deep learning for survival analysis |

### Which One to Use?

- If you are looking for a **general, user-friendly** tool: `Lifelines` is a great starting point.
- If you want to use **machine learning** methods: `Scikit-Survival` or `PySurvival` are great options.
- If you're familiar with **scikit-learn** and want to integrate survival analysis into ML pipelines: `Scikit-Survival` will feel natural.
- If you need **deep learning-based survival models**: Use `TensorFlow` or `PyTorch`.

Let me know if you need examples with any specific library!

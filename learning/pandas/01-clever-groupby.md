# Tutorial: Finding Shared Variables Between Tables in a Pandas DataFrame

If you have a dataset where two columns represent `table_name` and `var_name`, and you want to identify which variables are shared between multiple tables, this tutorial will guide you through the process using pandas.

### Objective:

To group variables by their names and display which variables are shared between different tables.

### Step-by-step guide:

### Step 1: Import necessary libraries

First, we need to import pandas to manipulate our dataset.

```python
import pandas as pd
```

### Step 2: Create your DataFrame

For the purpose of this tutorial, let's create an example DataFrame. You can replace this with your actual data.

```python
# Sample data
data = {
    'table_name': ['table1', 'table1', 'table2', 'table2', 'table3', 'table3', 'table3'],
    'var_name': ['var1', 'var2', 'var1', 'var3', 'var1', 'var2', 'var4']
}

# Create the DataFrame
df = pd.DataFrame(data)
```

Your DataFrame should look like this:

| table_name | var_name |
| ---------- | -------- |
| table1     | var1     |
| table1     | var2     |
| table2     | var1     |
| table2     | var3     |
| table3     | var1     |
| table3     | var2     |
| table3     | var4     |

### Step 3: Group by `var_name` and aggregate `table_name`

To find out which tables contain the same variable, we can group the DataFrame by `var_name` and aggregate the `table_name` into a list. This will help us see which tables have the same variable.

```python
# Group by `var_name` and collect the unique table names
grouped = df.groupby('var_name')['table_name'].unique().reset_index()

# Display the grouped result
print(grouped)
```

The output of this will show which tables contain each variable:

| var_name | table_name                     |
| -------- | ------------------------------ |
| var1     | ['table1', 'table2', 'table3'] |
| var2     | ['table1', 'table3']           |
| var3     | ['table2']                     |
| var4     | ['table3']                     |

### Step 4: Filter to find shared variables

To filter out variables that are present in more than one table, you can check the length of the list of `table_name`s for each `var_name`. If the length is greater than 1, it means that the variable is shared between tables.

```python
# Filter variables that appear in more than one table
shared_vars = grouped[grouped['table_name'].apply(len) > 1]

# Display the shared variables
print(shared_vars)
```

This will produce a DataFrame showing only the variables that are shared across multiple tables:

| var_name | table_name                     |
| -------- | ------------------------------ |
| var1     | ['table1', 'table2', 'table3'] |
| var2     | ['table1', 'table3']           |

### Step 5: Interpret the results

Now, we can see that:

- **var1** is shared between `table1`, `table2`, and `table3`.
- **var2** is shared between `table1` and `table3`.

Any variables that are not shared between tables (like `var3` and `var4`) have been filtered out.

### Conclusion

In this tutorial, we’ve walked through a simple way to identify which variables are shared between different tables using pandas. The key steps involve:

1. Grouping the data by `var_name` and collecting the unique `table_name`s.
2. Filtering out the variables that are shared by checking how many unique tables each variable appears in.

This method can be adapted to larger datasets and more complex scenarios depending on your needs.

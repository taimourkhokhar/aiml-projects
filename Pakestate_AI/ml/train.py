import pandas as pd
import os

current_dir = os.path.dirname(__file__)
print(current_dir)

file_path = os.path.join(current_dir, "zameen-updated.csv")

df = pd.read_csv(file_path)

print(df.head())


print(df.shape, df.dtypes, df.isnull().sum())
print(df.describe())
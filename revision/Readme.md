# Revision

### **Comments From TA:**

- -1.75: Query 1: Indexes 1 and 2 are on attributes in the SELECT clause. Index 3 is on an attribute not in query at all
- -0.583: Query 2: Index 1 is on an attribute in the SELECT clause
- -1.75: Query 3: All indexes are on attributes in the SELECT clause

### Sections we made changes:

1. Add default indexes listing of Table UserAccount in section **2.2.1** User Management
2. **4.1.2 Analysis** of indexes of the first advanced query
3. **4.2.2 Tradeoffs**: replacing the first index with a different Strategy
4. **4.3 Future Course Plan**: Analysis of indexes of the third advanced query

### Brief Explanations:

- For the **first and third** advanced query, we found that attributes in WHERE are already automatically generated indexes, serving as primary or foreign keys. So we made further explanations in certain sections mentioned above, **4.1.2 and 4.3**.
- For the **second** advanced query, we replace the first index with attributes that appears in GROUP BY instead of SELECT clause. Details introduced in **4.2.2**.
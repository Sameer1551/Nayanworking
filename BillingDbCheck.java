import java.sql.*;
public class BillingDbCheck {
  public static void main(String[] args) throws Exception {
    String url = "jdbc:mysql://localhost:3306/nayan-db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
    try (Connection conn = DriverManager.getConnection(url, "root", "root")) {
      try (Statement st = conn.createStatement()) {
        for (String table : new String[]{"billing_products", "billing_records"}) {
          try (ResultSet rs = st.executeQuery("SELECT COUNT(*) FROM " + table)) {
            rs.next();
            System.out.println(table + " rows=" + rs.getInt(1));
          }
        }

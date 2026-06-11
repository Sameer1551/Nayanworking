import java.sql.*;
public class BillingDbAutoReset {
  public static void main(String[] args) throws Exception {
    String url = "jdbc:mysql://localhost:3306/nayan-db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
    try (Connection conn = DriverManager.getConnection(url, "root", "root")) {
      try (Statement st = conn.createStatement()) {
        st.execute("ALTER TABLE billing_products AUTO_INCREMENT = 1");
        st.execute("ALTER TABLE billing_records AUTO_INCREMENT = 1");

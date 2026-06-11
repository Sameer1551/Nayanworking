import java.sql.*;
public class BillingHardReset {
  public static void main(String[] args) throws Exception {
    String url = "jdbc:mysql://localhost:3306/nayan-db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
    try (Connection conn = DriverManager.getConnection(url, "root", "root")) {
      try (Statement st = conn.createStatement()) {
        st.execute("SET FOREIGN_KEY_CHECKS=0");
        st.execute("DROP TABLE IF EXISTS billing_products");
        st.execute("DROP TABLE IF EXISTS billing_records");

        st.execute("CREATE TABLE billing_records ("
          + "id bigint NOT NULL AUTO_INCREMENT,"
          + "additional_notes text,"
          + "advance_paid decimal(38,2) DEFAULT NULL,"
          + "amount decimal(38,2) DEFAULT NULL,"
          + "authorized_signatory varchar(255) DEFAULT NULL,"
          + "axis_left varchar(255) DEFAULT NULL,"
          + "axis_right varchar(255) DEFAULT NULL,"
          + "bill_date date DEFAULT NULL,"

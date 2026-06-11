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
          + "bill_number varchar(255) DEFAULT NULL,"
          + "branch_code varchar(255) DEFAULT NULL,"
          + "branch_name varchar(255) DEFAULT NULL,"
          + "created_at datetime(6) DEFAULT NULL,"
          + "customer_address text,"
          + "customer_contact varchar(255) DEFAULT NULL,"
          + "customer_email varchar(255) DEFAULT NULL,"
          + "customer_name varchar(255) DEFAULT NULL,"
          + "cyl_left varchar(255) DEFAULT NULL,"
          + "cyl_right varchar(255) DEFAULT NULL,"
          + "discount decimal(38,2) DEFAULT NULL,"
          + "final_payable decimal(38,2) DEFAULT NULL,"
          + "lens_power_left varchar(255) DEFAULT NULL,"
          + "lens_power_right varchar(255) DEFAULT NULL,"
          + "payment_method varchar(255) DEFAULT NULL,"
          + "payment_status varchar(255) DEFAULT NULL,"
          + "pd varchar(255) DEFAULT NULL,"
          + "pd_left varchar(255) DEFAULT NULL,"
          + "pd_right varchar(255) DEFAULT NULL,"

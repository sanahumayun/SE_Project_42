import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
import time
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.chrome.options import Options

class LMSTestSuite(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        chrome_options = Options()
        
        # ====== DISABLE PASSWORD & AUTOFILL FEATURES ======
        chrome_options.add_argument("--disable-features=PasswordManager,Autofill,EnablePasswordGeneration")
        chrome_options.add_argument("--disable-single-click-autofill")
        chrome_options.add_argument("--disable-autofill-keyboard-accessory-view[8]")
        
        # ====== DISABLE SAFE BROWSING & LEAK DETECTION ======
        chrome_options.add_argument("--safebrowsing-disable-download-protection")
        chrome_options.add_argument("--safebrowsing-disable-extension-blacklist")
        chrome_options.add_argument("--enable-password-leak-detection=false")  # Critical for breach alerts
        
        # ====== BLOCK PASSWORD SAVE PROMPTS & INFO BARS ======
        chrome_options.add_argument("--disable-infobars")
        chrome_options.add_argument("--disable-save-password-bubble")
        chrome_options.add_argument("--disable-popup-blocking")  # Prevents other popups
        
        # ====== EXPERIMENTAL PREFERENCES (MOST IMPORTANT) ======
        prefs = {
            "credentials_enable_service": False,
            "profile.password_manager_enabled": False,
            "password_manager_enabled": False,  # Extra layer
            "safebrowsing.enabled": False,  # Disables Safe Browsing checks
            "profile.default_content_setting_values.notifications": 2,  # Blocks notifications
            "profile.content_settings.exceptions.automatic_downloads.*.setting": 1,  # Auto-downloads allowed
        }
        chrome_options.add_experimental_option("prefs", prefs)
        
        # ====== USE A FRESH PROFILE (OPTIONAL BUT RECOMMENDED) ======
        chrome_options.add_argument("--incognito")
        # chrome_options.add_argument("--incognito")  # Alternative if needed
        
        cls.driver = webdriver.Chrome(options=chrome_options)
        cls.driver.maximize_window()
        cls.base_url = "http://localhost:3000"
        
    @classmethod
    def tearDownClass(cls):
        pass

    def save_screenshot_on_failure(self, name):
        filename = f"screenshots/{name}.png"
        os.makedirs("screenshots", exist_ok=True)
        self.driver.save_screenshot(filename)

    def login(self, email, password):
        self.driver.get(f"{self.base_url}/")
        wait = WebDriverWait(self.driver, 10)
        wait.until(EC.presence_of_element_located((By.NAME, "email"))).send_keys(email)
        self.driver.find_element(By.NAME, "password").send_keys(password)
        self.driver.find_element(By.CLASS_NAME, "login-button").click()

    def login_with_token(self, token):
        self.driver.get(f"{self.base_url}/")
        self.driver.execute_script(f"window.localStorage.setItem('authToken', '{token}');")
        self.auth_token = self.driver.execute_script("return window.localStorage.getItem('authToken');")
        if not self.auth_token:
            raise Exception("Auth token was not successfully set in localStorage.")

    def test_01_invalid_login(self):
        try:
            self.login("Admin123@gmail.com", "Admin")

            alert = WebDriverWait(self.driver, 10).until(EC.alert_is_present())
            alert_text = alert.text
            self.assertEqual(alert_text, "Invalid credentials")
            alert.accept()
            
            self.save_screenshot_on_failure("test_01_invalid_login_alert")

            time.sleep(1)

            try:
                dashboard_element = WebDriverWait(self.driver, 5).until(
                    EC.presence_of_element_located((By.CLASS_NAME, "dashboard-layout"))
                )
                self.assertFalse(dashboard_element.is_displayed())
            except TimeoutException:
                pass

        except Exception:
            self.save_screenshot_on_failure("test_01_invalid_login")
            raise


    def test_02_successful_login(self):
        try:
            self.login("Admin123@gmail.com", "Admin123")
            dashboard_element = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "dashboard-layout"))
            )
            self.assertTrue(dashboard_element.is_displayed())
        except Exception:
            self.save_screenshot_on_failure("test_01_successful_login")
            raise

    def test_03_create_course(self):
        try:
            token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZmJkZGU4MDIzNDBhMDAxNmI4OTRmYSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0NjA5Mzc2OSwiZXhwIjoxNzQ2MDk3MzY5fQ.dJFs17f3M-oaYscECZZhtQRxHWT9MIXsS0vKt8sp4I0"
            self.login_with_token(token)
            self.driver.get(f"{self.base_url}/create-course")
            WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "course-form")))
            title_input = self.driver.find_element(By.XPATH, "//form[@class='course-form']//input[@type='text']")
            description_input = self.driver.find_element(By.XPATH, "//form[@class='course-form']//textarea")
            instructor_select = self.driver.find_element(By.XPATH, "//form[@class='course-form']//select")
            title_input.send_keys("Test Course")
            description_input.send_keys("Automated course description.")
            Select(instructor_select).select_by_index(1)
            self.driver.find_element(By.CLASS_NAME, "submit-button").click()
            WebDriverWait(self.driver, 10).until(
                EC.text_to_be_present_in_element(
                    (By.CLASS_NAME, "feedback-message"),
                    "✅ Course created successfully!"
                )
            )
        except Exception:
            self.save_screenshot_on_failure("test_03_create_course")
            raise

    def test_04_enroll_student(self):
        try:
            token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZmJkZGU4MDIzNDBhMDAxNmI4OTRmYSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0NjA5Mzc2OSwiZXhwIjoxNzQ2MDk3MzY5fQ.dJFs17f3M-oaYscECZZhtQRxHWT9MIXsS0vKt8sp4I0"
            self.login_with_token(token)
            self.driver.get(f"{self.base_url}/course-list")
            WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "course-grid")))
            enroll_dropdown = self.driver.find_element(By.XPATH, "//div[@class='enroll-form']//select")
            options = enroll_dropdown.find_elements(By.TAG_NAME, "option")
            options[1].click()
            enroll_button = self.driver.find_element(By.XPATH, "//div[@class='enroll-form']//button")
            enroll_button.click()
            WebDriverWait(self.driver, 10).until(EC.alert_is_present())
            self.driver.switch_to.alert.accept()
            WebDriverWait(self.driver, 10).until(EC.alert_is_present())
            success_alert = self.driver.switch_to.alert
            alert_text = success_alert.text
            success_alert.accept()
            time.sleep(2)
            self.assertIn("enrolled", self.driver.page_source.lower())
        except Exception:
            self.save_screenshot_on_failure("test_04_enroll_student")
            raise

    def test_05_submit_assignment(self):
        try:
            token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZmNmOWI3YWYwZTJmY2Y1ZWE0ZmQ0OSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzQ2MDkzODc5LCJleHAiOjE3NDYwOTc0Nzl9.BxyvnZjOecnv60DRf2TFWrkCWV-eXBwBgu8dvlaD6dc"
            self.login_with_token(token)
            self.driver.get(f"{self.base_url}/student-course-view")
            WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "course-list")))
            time.sleep(3)
            textarea = self.driver.find_element(By.CSS_SELECTOR, ".assignment-item .submission-textarea")
            textarea.send_keys("My assignment content here.")
            time.sleep(3)
            self.driver.find_element(By.XPATH, "//div[@class='assignments-section']//button").click()
            time.sleep(3)
            WebDriverWait(self.driver, 10).until(EC.alert_is_present())
            alert = self.driver.switch_to.alert
            alert_text = alert.text
            alert.accept()
            self.assertIn("Assignment submitted successfully!", alert_text)
            time.sleep(5)
        except Exception:
            self.save_screenshot_on_failure("test_05_submit_assignment")
            raise

    def test_06_missing_content(self):
        try:
            token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZmNmOWI3YWYwZTJmY2Y1ZWE0ZmQ0OSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzQ2MDkzODc5LCJleHAiOjE3NDYwOTc0Nzl9.BxyvnZjOecnv60DRf2TFWrkCWV-eXBwBgu8dvlaD6dc"
            self.login_with_token(token)
            self.driver.get(f"{self.base_url}/student-course-view")
            WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "course-list")))
            time.sleep(3)
            textarea = self.driver.find_element(By.CSS_SELECTOR, ".assignment-item .submission-textarea")
            textarea.clear()
            time.sleep(1)
            self.driver.find_element(By.XPATH, "//div[@class='assignments-section']//button").click()
            time.sleep(3)
            WebDriverWait(self.driver, 10).until(EC.alert_is_present())
            alert = self.driver.switch_to.alert
            alert_text = alert.text
            alert.accept()
            self.assertIn("please provide your submission", alert_text.lower())
            time.sleep(5)
        except Exception:
            self.save_screenshot_on_failure("test_06_missing_content")
            raise

    def test_07_tutor_empty_upload(self):
        try:
            token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZmM4MjI5Nzc0ODgxNzdhMjZhMzczZSIsInJvbGUiOiJ0dXRvciIsImlhdCI6MTc0NjA5MzkzNSwiZXhwIjoxNzQ2MDk3NTM1fQ.3mHqiovT-JdkqtURuid_9rlaGA1sg_DI2024E-yP6sE"
            self.login_with_token(token)
            self.driver.get(f"{self.base_url}/courses/tutor-course-view")
            WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "course-list")))
            time.sleep(3)
            title_input = self.driver.find_element(By.NAME, "title")
            description_textarea = self.driver.find_element(By.NAME, "description")
            due_date_input = self.driver.find_element(By.NAME, "dueDate")
            upload_button = self.driver.find_element(By.XPATH, "//button[text()='Upload Assignment']")
            title_input.clear()
            description_textarea.clear()
            due_date_input.clear()
            time.sleep(1)
            upload_button.click()
            WebDriverWait(self.driver, 10).until(EC.alert_is_present())
            alert = self.driver.switch_to.alert
            alert_text = alert.text
            alert.accept()
            self.assertIn("please fill all assignment fields", alert_text.lower())
            time.sleep(5)
        except Exception:
            self.save_screenshot_on_failure("test_07_tutor_empty_upload")
            raise


class EmojiTestResult(unittest.TextTestResult):
    def addSuccess(self, test):
        super().addSuccess(test)
        self.stream.write(f"✅ {test}\n")

    def addFailure(self, test, err):
        super().addFailure(test, err)
        self.stream.write(f"❌ {test} - FAILURE\n")

    def addError(self, test, err):
        super().addError(test, err)
        self.stream.write(f"❌ {test} - ERROR\n")

class EmojiTestRunner(unittest.TextTestRunner):
    def _makeResult(self):
        return EmojiTestResult(self.stream, self.descriptions, self.verbosity)

if __name__ == "__main__":
    unittest.main(testRunner=EmojiTestRunner(verbosity=2), exit=False)


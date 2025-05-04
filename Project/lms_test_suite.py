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
import requests

@staticmethod
def get_token(email, password):
    url = "http://localhost:3000/api/auth/login"
    response = requests.post(url, json={"email": email, "password": password})
    return response.json()["token"]

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
            token = get_token("Student1@gmail.com", "Student1")
            self.login_with_token(token)
            self.driver.get(f"{self.base_url}/create-course")
            WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.CLASS_NAME, "course-form")))
            title_input = self.driver.find_element(By.XPATH, "//form[@class='course-form']//input[@type='text']")
            description_input = self.driver.find_element(By.XPATH, "//form[@class='course-form']//textarea")
            instructor_select = self.driver.find_element(By.XPATH, "//form[@class='course-form']//select")
            title_input.send_keys("Test Course1")
            description_input.send_keys("Automated course description.")
            Select(instructor_select).select_by_index(2)
            self.driver.find_element(By.CLASS_NAME, "submit-button").click()
            WebDriverWait(self.driver, 10).until(
                EC.text_to_be_present_in_element(
                    (By.CLASS_NAME, "feedback-message"),
                    "✅ Course and chatroom created successfully!"
                )
            )
        except Exception:
            self.save_screenshot_on_failure("test_03_create_course")
            raise

    def test_04_enroll_student(self):
        try:
            token = get_token("Student1@gmail.com", "Student1")
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
            token = get_token("Student1@gmail.com", "Student1")
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
            token = get_token("Student1@gmail.com", "Student1")
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
            token = get_token("Admin123@gmail.com", "Admin123")
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

    
    def test_08_create_chatroom(self):
        try:
            token = get_token("Admin123@gmail.com", "Admin123")
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
                    "✅ Course and chatroom created successfully"
                )
            )
        except Exception:
            self.save_screenshot_on_failure("test_08_create_chatroom")
            raise

    def test_09_add_student_to_chatroom(self):
        try:
            print("🔐 Logging in as Admin...")
            token = get_token("Admin123@gmail.com", "Admin123")
            self.login_with_token(token)
            
            print("🌐 Navigating to course list...")
            self.driver.get(f"{self.base_url}/course-list")
            
            print("⏳ Waiting for course cards to load...")
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "course-card"))
            )
            print("✅ Course cards loaded.")
            
            print("🔍 Searching for the 'chatapp2' course...")
            courses = self.driver.find_elements(By.CLASS_NAME, "course-card")
            chatapp_course = None
            
            for course in courses:
                course_name = course.text.strip()
                print(f"Found course: {course_name}")
                if "chatapp2" in course_name.lower():
                    chatapp_course = course
                    break
            
            if not chatapp_course:
                raise Exception("Course 'chatapp2' not found.")
            
            print("✅ Found 'chatapp2' course.")
            chatapp_course.click()

            print("⏳ Waiting for the enrollment dropdown...")
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "(//select)[1]"))
            )
            
            print("🔍 Locating the first <select> element for enrollment...")      
            enroll_select = self.driver.find_element(By.XPATH, "(//select)[1]")
            enroll_select.click()
            
            print("📋 Fetching dropdown options...")
            options = enroll_select.find_elements(By.TAG_NAME, "option")
            print(f"Found {len(options)} options in dropdown.")
            
            print("✅ Selecting the first student option...")
            options[3].click()  
            
            print("🎯 Clicking the Enroll button...")
            enroll_button = self.driver.find_element(By.XPATH, "(//button[text()='Enroll'])[1]")
            enroll_button.click()

            print("⏳ Waiting for alert...")
            WebDriverWait(self.driver, 5).until(EC.alert_is_present())
            alert = self.driver.switch_to.alert
            alert_text = alert.text
            print(f"📢 Alert received: {alert_text}")
            
            if "enroll this student" in alert_text.lower():
                print("✅ Confirming enrollment.")
                alert.accept()
                
                print("⏳ Waiting for success or failure alert...")
                WebDriverWait(self.driver, 5).until(EC.alert_is_present())
                success_alert = self.driver.switch_to.alert
                success_alert_text = success_alert.text
                print(f"📢 Success alert: {success_alert_text}")
                
                if "enrolled" in success_alert_text.lower():
                    print("🎉 Enrollment successful!")
                elif "failed" in success_alert_text.lower():
                    print("❌ Enrollment failed.")
                success_alert.accept()
            elif "failed" in alert_text.lower():
                print("❌ Enrollment failed.")
                alert.accept()
            
        except Exception as e:
            print(f"❌ Test failed: {str(e)}")
            self.save_screenshot_on_failure("test_09_add_student_to_chatroom")
            raise






    def test_10_remove_student_from_chatroom(self):
        try:
            print("🔐 Logging in as Admin...")
            token = get_token("Admin123@gmail.com", "Admin123")
            self.login_with_token(token)
            
            print("🌐 Navigating to course list...")
            self.driver.get(f"{self.base_url}/course-list")
            
            print("⏳ Waiting for course cards to load...")
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "course-card"))
            )
            print("✅ Course cards loaded.")
            
            print("🔍 Searching for the 'chatapp2' course...")
            courses = self.driver.find_elements(By.CLASS_NAME, "course-card")
            chatapp_course = None
            
            for course in courses:
                course_name = course.text.strip()
                print(f"Found course: {course_name}")
                if "chatapp2" in course_name.lower():
                    chatapp_course = course
                    break
            
            if not chatapp_course:
                raise Exception("Course 'chatapp2' not found.")
            
            print("✅ Found 'chatapp2' course.")
            chatapp_course.click()
            
            print("⏳ Waiting for the remove student dropdown...")
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "(//select)[1]"))
            )
            
            print("🔍 Locating the first <select> element for removing a student...")      
            remove_select = self.driver.find_element(By.XPATH, "(//select)[1]")
            remove_select.click()
            
            print("📋 Fetching dropdown options...")
            options = remove_select.find_elements(By.TAG_NAME, "option")
            print(f"Found {len(options)} options in dropdown.")
            
            print("✅ Selecting the first student option...")
            options[3].click() 
            
            print("🎯 Clicking the Remove button...")
            remove_button = self.driver.find_element(By.XPATH, "(//button[text()='Remove'])[1]")
            remove_button.click()

            print("⏳ Waiting for alert...")
            WebDriverWait(self.driver, 5).until(EC.alert_is_present())
            alert = self.driver.switch_to.alert
            alert_text = alert.text
            print(f"📢 Alert received: {alert_text}")
            
            if "remove this student" in alert_text.lower():
                print("✅ Confirming removal.")
                alert.accept()
                
                print("⏳ Waiting for success or failure alert...")
                WebDriverWait(self.driver, 5).until(EC.alert_is_present())
                success_alert = self.driver.switch_to.alert
                success_alert_text = success_alert.text
                print(f"📢 Success alert: {success_alert_text}")
                
                if "removed" in success_alert_text.lower():
                    print("🎉 Removal successful!")
                elif "failed" in success_alert_text.lower():
                    print("❌ Removal failed.")
                success_alert.accept()
            elif "failed" in alert_text.lower():
                print("❌ Removal failed.")
                alert.accept()
            
        except Exception as e:
            print(f"❌ Test failed: {str(e)}")
            self.save_screenshot_on_failure("test_10_remove_student_from_chatroom")
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


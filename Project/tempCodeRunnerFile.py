    def test_09_add_student_to_chatroom(self):
        try:
            # Login as Admin
            print("🔐 Logging in as Admin...")
            token = get_token("Admin123@gmail.com", "Admin123")
            self.login_with_token(token)
            
            # Navigate to Course List page
            print("🌐 Navigating to course list...")
            self.driver.get(f"{self.base_url}/course-list")
            
            # Wait for course cards to load
            print("⏳ Waiting for course cards to load...")
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "course-card"))
            )
            print("✅ Course cards loaded.")
            
            # Find the course called "chatapp2" and click it
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

            # Wait for the enrollment dropdown to be visible
            print("⏳ Waiting for the enrollment dropdown...")
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "(//select)[1]"))
            )
            
            # Find the first enroll dropdown and select a student
            print("🔍 Locating the first <select> element for enrollment...")      
            enroll_select = self.driver.find_element(By.XPATH, "(//select)[1]")
            enroll_select.click()
            
            # Fetch options and print them
            print("📋 Fetching dropdown options...")
            options = enroll_select.find_elements(By.TAG_NAME, "option")
            print(f"Found {len(options)} options in dropdown.")
            
            # Select the first student option
            print("✅ Selecting the first student option...")
            options[1].click()  # Selecting the second option (since the first is a placeholder)
            
            # Click the corresponding "Enroll" button
            print("🎯 Clicking the Enroll button...")
            enroll_button = self.driver.find_element(By.XPATH, "(//button[text()='Enroll'])[1]")
            enroll_button.click()

            # Handle alert
            print("⏳ Waiting for alert...")
            WebDriverWait(self.driver, 5).until(EC.alert_is_present())
            alert = self.driver.switch_to.alert
            alert_text = alert.text
            print(f"📢 Alert received: {alert_text}")
            
            if "enroll this student" in alert_text.lower():
                print("✅ Confirming enrollment.")
                alert.accept()
                
                # Wait for success or failure alert
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
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.common.exceptions import NoSuchElementException
from selenium.common.exceptions import TimeoutException
import re
import time
import id
import random

#open linkedin.com
driver = webdriver.Chrome()
driver.get("https://linkedin.com/login")

sleep = random.randint(3, 7)

time.sleep(sleep)

#find UN/PW fields on the page
username = driver.find_element(By.XPATH, "//input[@name='session_key']")
password = driver.find_element(By.XPATH, "//input[@name='session_password']")

#Input login credentials
username.send_keys("mayankrawatp001@gmail.com")
password.send_keys("2tV$!)EqLN/6jQ*")

time.sleep(sleep)
#click the submit button to login
submit = driver.find_element(By.XPATH, "//button[@type='submit']").click()

time.sleep(15)

total_id = id.get_id()
total_id_len = len(total_id)
for n in range(1,total_id_len):
    time.sleep(sleep)
    
    driver.get("https://www.linkedin.com/in/"+ str(total_id[n]))

    try:
        close_button = driver.find_element(By.XPATH, "//button[@class='msg-overlay-bubble-header__control artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--1 artdeco-button--tertiary ember-view']")
        driver.execute_script("arguments[0].click()", close_button)
    except NoSuchElementException:
        print("Error: close button not found for " + total_id[n])

    try:
        id_name = driver.find_element(By.XPATH, "//h1[starts-with(@class, 'fCfuHhrjRZGYdLuQhrscJxfpYYKFftQeUAQk')]")
    except NoSuchElementException:
        id_name = " "
        print("Error: h1 element with the specified class not found for " + total_id[n])

    text = id_name.text

    # Remove all non-alphanumeric characters
    id_name_rem = re.sub(r"[^\w\s]", "", text)
    # Remove extra whitespace (multiple spaces, tabs, newlines)
    id_name_final = re.sub(r"\s+", " ", id_name_rem).strip()

    time.sleep(sleep)

    all_buttons = driver.find_elements(By.TAG_NAME, "button")
    message_buttons = [btn for btn in all_buttons if btn.text == "Message"]

    for i in range(0, 1):
        
        driver.execute_script("arguments[0].click()", message_buttons[i])
        time.sleep(sleep)

        #click on the "enter message field"
        try:
            main_div = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//div[starts-with(@class, 'msg-form__msg-content-container') or starts-with(@class, 'msg-form__contenteditable')]"))
            )
            driver.execute_script("arguments[0].click()", main_div)
        except TimeoutException:
            print("Error: Element not found within 10 seconds")
        
        time.sleep(sleep)
                    
        #greetings array
        greetings = ["Hello", "Hey", "Hi"]    
            
        #generate greeting phrase
        greetings_idx = random.randint(0, len(greetings)-1)
        message = greetings[greetings_idx] + " " + id_name_final + ", nice to meet you. I hope you had a great weekend!"
        
        #type message in message field with value of ""
        paragraphs = driver.find_elements(By.TAG_NAME, "p")
        paragraphs[-5].send_keys(message)
        time.sleep(sleep)

        #send message
        submit = driver.find_element(By.XPATH, "//button[@type='submit']")
        driver.execute_script("arguments[0].click()", submit)

        time.sleep(8)

        #close message box
        try:
            close_button = driver.find_element(By.XPATH, "//button[@class='msg-overlay-bubble-header__control artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--1 artdeco-button--tertiary ember-view']")
            driver.execute_script("arguments[0].click()", close_button)
        except NoSuchElementException:
            print("Error: close button not found for " + total_id[n])

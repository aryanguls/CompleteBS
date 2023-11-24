// signup.tsx
import React, { FC, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Signup.module.css';

interface LoginProps {}

const Login: FC<LoginProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Login is successful
        return true;
      } else {
        // Handle errors, e.g., invalid credentials
        setError(data.error || 'Login failed. Please try again.');
        setShowPopup(true);
        return false;
      }
    } catch (error) {
      console.error('Login Error:', error);
      setError('An error occurred during login. Please try again.');
      setShowPopup(true);
      return false;
    }
  };
  

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all the fields.');
      setShowPopup(true);
      return;
    }

    // Call the handleLogin function and wait for the result
    const loginSuccessful = await handleLogin();

    if (loginSuccessful) {
      // Redirect to the chatbot page if login is successful
      router.push('/chatbot');
    } else {
      // If the login is not successful, show an error message
      setError('Invalid credentials, please try again.');
      setShowPopup(true);
    }
  };

  
  const closePopup = () => {
    setShowPopup(false);
    setError('');
  };

  return (
    <div>
      <Head>
          <title>CompleteBS - Stop Making Sense</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <nav>
        <div className={styles.navContainer}>
          <div className={styles.brand}>
            <img src="/logo2bg.png" alt="CompleteBS Logo" className={styles.logoIcon} />
            <Link href="/">
                <span className={styles.brandName}>CompleteBS</span>
            </Link>
          </div>
        </div>
      </nav>
       <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <h1>Start the Fun</h1>
          <input 
            type="email" 
            placeholder="Email" 
            className={styles.authInput}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password" 
            className={styles.authInput}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleSubmit} className={styles.authButton}>Log in</button>
          <div id="g-signin2"></div>
          <p className={styles.loginLink}>
            <Link href="/signup">
              <span>Don't have an account? Sign up.</span>
            </Link>
          </p>
        </div>
      </div>
      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <span className={styles.close} onClick={closePopup}>&times;</span>
            <p className={styles.popupText}>{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;

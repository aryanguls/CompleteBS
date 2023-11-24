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
    // Placeholder for login logic
    // In a real scenario, you would make an API call to the backend to verify the credentials
    // For this example, we will just simulate a login with a timeout
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true); // Resolve with 'true' to simulate successful login
      }, 500);
    });
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

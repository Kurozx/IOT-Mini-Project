import styles from '../app/footer.module.css'; // Make sure to adjust the path to your CSS module

export default function Footer() {
  return (
    <div className={`container-fluid ${styles.footerContainer}`}>
      <footer className={`py-4 ${styles.footer}`}>
        <ul className="nav justify-content-center border-bottom pb-3 mb-3">
          <li className="nav-item"><a href="./" className={`nav-link px-3 ${styles.navLink}`}>Home</a></li>
          <li className="nav-item"><a href="/About" className={`nav-link px-3 ${styles.navLink}`}>About</a></li>
          <li className="nav-item"><a href="/Service" className={`nav-link px-3 ${styles.navLink}`}>Service</a></li>
          <li className="nav-item"><a href="/Contact" className={`nav-link px-3 ${styles.navLink}`}>Contact</a></li>
        </ul>
        <p className={`text-center ${styles.footerText}`}>© 2024 STARBUG, Inc</p>
      </footer>
    </div>
  );
}

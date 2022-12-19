import Link from "next/link";
import styles from "../styles/home.module.scss";
import useMediaQuery, { mobileBreakpoint } from "../modules/device";

import Meta from "../components/Meta";
import Gooey from "../components/Gooey";

export default function Home() {
  const mobile = useMediaQuery(mobileBreakpoint);

  return (
    <Meta>
      <div className={styles.main}>
        <Gooey mobile={mobile} />
        <div className={styles.footer}>
          <p className={styles.header}>the new internet is here</p>
          {!mobile && (
            <div className={styles.column}>
              <Link
                className={styles.link}
                href="https://boysclub.medium.com/"
                target="_blank"
              >
                About
              </Link>
            </div>
          )}
          <div className={styles.column}>
            {mobile && (
              <div className={styles.column}>
                <Link
                  className={styles.link}
                  href="https://boysclub.medium.com/"
                  target="_blank"
                >
                  About
                </Link>
              </div>
            )}
            <Link
              className={styles.link}
              href="https://airtable.com/shryFnkv7KxIhIfJN"
              target="_blank"
            >
              Join
            </Link>
            <Link
              className={styles.link}
              href="https://open.spotify.com/show/34UHUOMlsMBf85aNOBhztV?si=630ad03f08cc402c"
              target="_blank"
            >
              Listen
            </Link>
          </div>
          <div className={styles.column}>
            <Link
              className={styles.link}
              href="https://boysclub.pallet.com/talent/welcome?referral=true"
              target="_blank"
            >
              Find Jobs
            </Link>
            <Link
              className={styles.link}
              href="https://boysclub.pallet.com/jobs"
              target="_blank"
            >
              Post a Job
            </Link>
          </div>
          <div className={styles.column}>
            <Link
              className={styles.link}
              href="https://twitter.com/BoysClubCrypto"
              target="_blank"
            >
              Twitter
            </Link>
            <Link
              className={styles.link}
              href="https://www.instagram.com/boysclub.eth/"
              target="_blank"
            >
              Insta
            </Link>
          </div>
        </div>
      </div>
    </Meta>
  );
}

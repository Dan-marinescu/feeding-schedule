import React from 'react';

const AccessibilityStatement: React.FC = () => (
  <main className="accessibility-statement" tabIndex={-1} aria-labelledby="accessibility-title">
    <h1 id="accessibility-title">הצהרת נגישות</h1>
    <section>
      <p>
        אתר זה מחויב להנגישות מלאה לכלל המשתמשים, לרבות אנשים עם מוגבלות, בהתאם לחוק שוויון זכויות לאנשים עם מוגבלות, התשנ"ח-1998 ותקנות הנגישות הישראליות (WCAG 2.0 רמה AA).
      </p>
      <ul>
        <li>האתר נבנה תוך הקפדה על מבנה סמנטי נכון, ניווט מקלדת, צבעים בעלי ניגודיות גבוהה, אפשרות להגדלת טקסט, ושימוש בתיאורי תמונה (alt).</li>
        <li>כל הטפסים באתר כוללים תוויות ברורות והודעות שגיאה נגישות.</li>
        <li>הפופ-אפים והמודלים באתר נגישים, ניתן לסגור אותם באמצעות מקש Esc, והם כוללים מלכודת פוקוס.</li>
        <li>קיים קישור "דלג לתוכן" בראש הדף.</li>
      </ul>
      <p>
        אנו עושים מאמצים מתמשכים לשפר את הנגישות באתר. אם נתקלתם בבעיה או יש לכם הערה בנושא נגישות, נשמח שתפנו אלינו:
      </p>
      <ul>
        <li>דוא"ל: <a href="mailto:dan.marinescu7693@gmail.com">dan.marinescu7693@gmail.com</a></li>
        <li>טלפון: <a href="tel:050-7300787">050-7300787</a></li>
      </ul>
      <p>
        נעדכן הצהרה זו מעת לעת בהתאם לשיפורים ועדכונים באתר.
      </p>
    </section>
  </main>
);

export default AccessibilityStatement; 
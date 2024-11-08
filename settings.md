npm install primereact primeicons
npm install --save @emotion/react @emtion/styled

pages/_app.js --wrtie here
import 'primereact/resources/themes/saga-blue/theme.css'; // 테마 CSS
import 'primereact/resources/primereact.min.css'; // 기본 스타일
import 'primeicons/primeicons.css'; // 아이콘 스타일

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;

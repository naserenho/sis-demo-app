import classes from "./Layout.module.css";
import Header from "./Header";
import Footer from "./Footer";

type DashboardLayoutProps = {
  children: React.ReactNode;
};
const Layout = (props: DashboardLayoutProps) => {
  return (
    <>
      <Header />
      <main className={classes.main}>{props.children}</main>
      <Footer />
    </>
  );
};

export default Layout;

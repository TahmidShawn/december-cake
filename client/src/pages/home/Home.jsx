import CakeBanner from "./banner/CakeBanner";
import Category from "./category/Category";
import HotDeals from "./hotDeals/HotDeals";

const Home = () => {
    return (
        <div>
            <CakeBanner />
            <Category />
            <HotDeals />
        </div>
    );
};

export default Home;

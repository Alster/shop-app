import { redirect } from "next/navigation";

const Home = async () => {
	redirect("/catalog/for-woman");
};

export default Home;

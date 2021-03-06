import React, { useState } from "react";

import Card from "../components/Card";

const Home = ({
	items,
	searchValue,
	setSearchValue,
	onChangeSearchInput,
	onAddToFavorite,
	onAddToCart,
	isLoading,
	favorites,
}) => {
	const [width, setWidth] = useState(4000);

	React.useEffect(() => {
		setWidth(document.querySelector("html").clientWidth);
	}, []);

	const renderItems = () => {
		const filteredItems = items.filter((item) =>
			item.title.toLowerCase().includes(searchValue.toLowerCase()),
		);

		return (isLoading ? [...Array(8)] : filteredItems).map((item, index) => (
			<Card
				key={index}
				onFavorite={(obj) => onAddToFavorite(obj)}
				onPlus={(obj) => onAddToCart(obj)}
				loading={isLoading}
				favorites={favorites.filter((fav) => fav.parentId === item.id).length > 0}
				{...item}
			/>
		));
	};

	return (
		<div className="content p-40">
			<div
				className={
					width > 768 ? "d-flex align-center justify-between mb-40" : "d-flex flex-column mb-40"
				}>
				<h1 className={width > 768 ? "" : "mb-20"}>
					{searchValue ? `Поиск по запросу: "${searchValue}"` : "Все товары"}
				</h1>
				<div className="search-block d-flex">
					<img src="img/search.svg" alt="Search" />
					{searchValue && (
						<img
							onClick={() => setSearchValue("")}
							className="clear cu-p"
							src="img/btn-remove.svg"
							alt="Clear"
						/>
					)}
					<input onChange={onChangeSearchInput} value={searchValue} placeholder="Поиск..." />
				</div>
			</div>

			<div className="d-flex flex-wrap">{renderItems()}</div>
		</div>
	);
};

export default Home;

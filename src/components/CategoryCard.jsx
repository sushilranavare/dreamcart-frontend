/*
* This component displays a single product category on the DreamCart Home page.
* */

function CategoryCard({ name, description }){
    return (
        <div className="category-card">
            <h3>{name}</h3>
            <p>{description}</p>
        </div>
    );
}
export default CategoryCard;
/*
* This component displays the single product in the DreamCart product grid.
* */

function ProductCard({ product }){
    return (
        <div className="product-card">

            <div className="product-image">
                <img
                src={product.imageUrl}
                alt={product.name}
                />
            </div>

            <div className="product-content">
                <h3>
                    {product.name}
                </h3>

                <p>
                    {product.description}
                </p>
                <strong>
                    ${product.price}
                </strong>

                <button>
                    View Product
                </button>
            </div>

        </div>
    );
}
export default ProductCard;
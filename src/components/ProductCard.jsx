/*
 * Reusable product card component.
 *
 * Displays product image, name, price,
 * description, and stock information.
 */

function ProductCard({ product }) {

    console.log("PRODUCT CARD DATA:", product);
    console.log("IMAGE URL FROM API:", product.imageUrl);

    let imageUrl = null;
    if (product.imageUrl){
        // If it's just a raw filename like abc.jpg , prepend the correct folder path
        if (!product.imageUrl.startsWith('/')){
            imageUrl = `http://localhost:8080/uploads/products/${product.imageUrl}`;
        }
        else {
            // If it already has the path
            imageUrl =`http://localhost:8080${product.imageUrl}`;
        }
        console.log("FINAL IMAGE URL:", imageUrl);

    }



    return (
        <div className="product-card">

            <div className="product-image-container">

                {imageUrl ? (

                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="product-image"
                        onLoad={() => {
                            console.log(
                                "IMAGE LOADED:",
                                imageUrl
                            );
                        }}
                        onError={(event) => {
                            console.error(
                                "IMAGE FAILED:",
                                event.currentTarget.src
                            );
                        }}
                    />

                ) : (

                    <div className="no-image">
                        No Image
                    </div>

                )}

            </div>

            <div className="product-card-content">

                <h3>
                    {product.name}
                </h3>

                <p className="product-description">
                    {product.description}
                </p>

                <p className="product-price">
                    ${product.price}
                </p>

                <p className="product-stock">
                    {product.stockQuantity > 0
                        ? `${product.stockQuantity} in stock`
                        : "Out of stock"
                    }
                </p>

            </div>

        </div>
    );
}

export default ProductCard;
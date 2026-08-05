import ProductForm from "../ProductForm/ProductForm";

export default function NewProduct({ product = null, onDone = () => {} }) {

    return (

        <section className="new-product">

            <ProductForm
                product={product}
                onDone={onDone}
            />

        </section>

    );

}

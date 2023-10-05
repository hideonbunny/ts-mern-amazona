import { useParams } from "react-router-dom";
import { useCategoryQuery } from "../hooks/categoryHooks";
import LoadingBox from "../components/LoadingBox";
import ProductItem from "../components/ProductItem";
import { Helmet } from "react-helmet-async";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils";
import { ApiError } from "../types/ApiError";
import { Col, Row } from "react-bootstrap";

function CategoryPage() {
  const params = useParams();
  const { category } = params;
  const { data: products, isLoading, error } = useCategoryQuery(category!);

  // const { state, dispatch } = useContext(Store);
  // const { cart } = state;

  // const navigate = useNavigate();

  return isLoading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{getError(error as ApiError)}</MessageBox>
  ) : (
    <Row>
      <Helmet>
        <title>{`${category}`}</title>
      </Helmet>
      {products!.map((product) => (
        <Col key={product.slug} sm={6} md={4} lg={3}>
          <ProductItem product={product}></ProductItem>
        </Col>
      ))}
    </Row>
  );
}

export default CategoryPage;

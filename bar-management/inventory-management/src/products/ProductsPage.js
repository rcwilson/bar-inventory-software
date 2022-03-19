import {Table, Spinner, Container, Button, Col, Row, OverlayTrigger, Tooltip, Modal} from 'react-bootstrap';
import {FaToolbox, FaUserInjured, FaPlus, FaTrash} from 'react-icons/fa'
import {useState, useEffect} from 'react';
import API from '../api/API';
import { Link } from 'react-router-dom';
import EditProductModal from '../components/modals/EditProductModal.js';


function ProductsPage() {

  async function getProducts() {
    setIsLoadingProducts(true);
    try {
      const result = await API.Products.getAll();
      if ( result.success && result.data.products.length > 0 ) {
        console.log("Products.js", result )
        setProducts(result.data.products)
      } else {
        setProducts(false)
      }  
    }
    catch ( error ) {
      console.log(error)
    }
    finally {
      setIsLoadingProducts(false);
    }
  } 
  const [products, setProducts] = useState({});
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  useEffect( () => {
    getProducts();
  }, [])

  const [productToDelete, setProductToDelete] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteProduct = product => {
    setProductToDelete(product);
    console.log('product to delete: ', product)
    handleShow();
  }
  const handleClose = () => setShowDeleteModal(false);
  const handleShow = () => setShowDeleteModal(true);
  const handleDelete = async () => {
    handleClose();
    const result = await API.Products.deleteProduct({_id: productToDelete._id})
    console.log('Delete Product', result);
    if( result.success ) {
      getProducts();
    } else {
      /**@TODO create alert modal component */
    }
  }

  const [productToEdit, setProductToEdit] = useState({});
    
  const [showEditModal, setShowEditModal] = useState(false);

  function handleEditProductClick( product ) {
    console.log("handleEditProductClick", product)
    setProductToEdit( product );
    setShowEditModal( true );
  }

  function handleEditModalClose() {
    setShowEditModal(false)
  }

  function ProductLoader () {
    return (
      <><Spinner animation="border"> <span className="visually-hidden"> Loading ... </span></Spinner></>
    )
  }

  function WarningModal (props) {
    return (
      <Modal key={true} centered backdrop="static" show={showDeleteModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete <b>{productToDelete.name}</b>?</Modal.Body>
        <Modal.Footer className='text-center'>
          <Button className='p-3' variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button className='p-1' variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  function ProductsToolbar ( {children} ) {
    return (
      <Container className='p-2 text-center bg-clear'>
        <Row>
          <Col>
            <Link to="/products/new" className='btn btn-primary'><FaPlus /> Add Product </Link>
          </Col>
        </Row>
      </Container>
    )
  }

  function ProductsTable ( {children} ) {
 
    const NoProductsFound = props => (
      <b style={{color: "white"}}><FaUserInjured/> You don't have any products</b>
    )

    const renderTooltip = props => (
      <Tooltip {...props}>
        {props.message}
      </Tooltip>
    )
    
    if( ! products || products == null) {
      return <NoProductsFound />
    }
    return (
      <Container>
          <Table striped bordered hover variant="dark" className="shadow">
            <thead>
              <tr>
                <th>Index</th>
                <th>Name</th>
                <th>Category</th>
                <th>Unit</th>
                <th>Package Size</th>
                <th>Package Price</th>
                <th>Distributor</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map(function(product, index){
                return ( 
                <tr key={product._id}>  
                  <td>{index+1}</td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.unit}</td>
                  <td>{product.package_units} UNIT / {product.package_type}</td>
                  <td>${product.package_price}</td>
                  <td>{product.distributor}</td>
                  <td> 
                    <Container>
                      <Row>
                          <Col>
                            <OverlayTrigger 
                                placement='top'
                                overlay={ renderTooltip({ message: "Edit" }) }
                              >
                                <Button onClick={ () => handleEditProductClick( products[index] )} variant='clear' className='text-light'>
                                  <FaToolbox />
                                </Button>
                            </OverlayTrigger>
                            <OverlayTrigger 
                                placement='top'
                                overlay={ renderTooltip({ message: "Delete" }) }
                              >
                                <Button onClick={ () => deleteProduct( products[index] )} className='text-light' variant='clear' >
                                  <FaTrash />
                                </Button>
                            </OverlayTrigger>
                          
                          </Col>
                      </Row>
                      </Container>
                    </td>
                </tr>
                )
              })}
            </tbody>
          </Table>
      </Container>
    )
  }

  return (
    <>  
      <Container>
      <WarningModal />
      <EditProductModal show={showEditModal} hide={handleEditModalClose} product={productToEdit} />
        <Col>
          <Row>
            {isLoadingProducts ? '' : <ProductsToolbar />}
          </Row>
          <Row>
            {isLoadingProducts ? <ProductLoader /> : <ProductsTable />}
          </Row>
        </Col>  
      </Container>
    </>

  );
}

export default ProductsPage;

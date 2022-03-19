import React, { useEffect, useState, useRef, createRef } from 'react'
import { Row, Col, Form, FormGroup, Stack, InputGroup, Button } from 'react-bootstrap'
import { Modal } from 'react-bootstrap'
import API from '../../api/API'

const categories = [
    {name: "Bottled Beer"},
    {name: "White Wine"},
    {name: "Red Wine"},
    {name: "Non-Alcoholic"}
]

const size = [
    {name: "12oz Bottle"},
    {name: "12oz Can"},
    {name: "16oz Bottle"},
    {name: "16oz Can"}
]

const package_size = [
    {name: "Case"},
    {name: "Keg"},
    {name: "Bottle"},
]

const product_distributor = [
    {name: "Heidleburg"},
    {name: "Vintage Wines"},
    {name: "Superior Dist."}
]

function EditProductModal({ product, show, hide, ...props }) {
    const [validated, setValidated] = useState(false);

    const packagePriceDollarsInput  = useRef();
    const packagePriceCentsInput    = useRef();
    const packagePriceCentsPrevious = useRef();
    const unitPriceInput            = useRef();

    const productNameInput           = useRef();
    const productCategoryInput       = useRef();
    const productUnitInput           = useRef();
    const productPackageUnitsInput   = useRef();
    const productPackageTypeInput    = useRef();
    const productDistributorInput    = useRef();

    function initPackagePriceSplit() {
        if( product.package_price ) {
            let splitPrice = product.package_price.toString().split('.');
            let dollars = parseInt(splitPrice[0]);
            let cents = parseInt(splitPrice[1] ?? 0);
            return [ dollars, cents ];
        } else {
            return ["0", "00"];
        }
    };
    const [ initPackagePriceDollars, initPackagePriceCents ] = initPackagePriceSplit();
  
    function initUnitPrice () {
        console.log(`calcUnitPrice: price: ${product.package_price}, units: ${product.package_units}`)
        if( product.package_price && product.package_units ) {
            const amount = ( product.package_price / product.package_units ).toFixed(2);
            console.log(`Amount: ${amount} Type: ${typeof amount} `)
            return amount;
        } else {
            return "00.00";
        }
    }
    function handleCalcUnitPriceChange(e) {
        const dollars   = parseInt(packagePriceDollarsInput.current['value']);
        const cents     = 0.01 * parseInt(packagePriceCentsInput.current['value']);
        const price     = dollars + cents;
        const units     = parseInt(productPackageUnitsInput.current['value']);
        const amount    = (price / units).toFixed(2);
            
        console.log('handleCalcUnitPrice', {dollars, cents, units, amount}, `${typeof dollars}, ${typeof cents}, ${typeof units}, ${typeof amount}`)
        unitPriceInput.current.value =  amount;
    }
    function handleDecimalButton(e) {
        if(e.key === '.'){ 
            console.log('handleDecimalButton', e.key, e.key === '.')
            e.preventDefault();
            if(e.target === packagePriceDollarsInput.current) packagePriceCentsInput.current.focus();
        }
    }

    function FormWrapper({ children, ...props }) {
        return (
        <Form noValidate validated={validated} id="newProductForm" className="p-4 bg-white shadow">
            { children }
        </Form>
        )
    }

    const ProductName = React.forwardRef((props, ref) => {
        return (
            <Form.Group as={Col} sm={12} md={6} controlId="formProductName">
                <Form.Label aria-label="Product Name" title="Product Name">Product name</Form.Label>
                <Form.Control defaultValue={product.name ?? ''} ref={ref} required name="product_name" autoComplete="off" type="text"></Form.Control>
            </Form.Group>
        )
    })
    const ProductCategory = React.forwardRef((props, ref) => {
        return (
            <Form.Group as={Col} sm={12} md={6} controlId="formProductCategory">
                <Form.Label>Product Category</Form.Label>
                <Form.Select defaultValue={product.category ?? false} ref={ref} required name="product_category">
                    {categories.map(function(category, index) {
                        return <option key={index} value={category.name}>{category.name}</option>
                    })}
                </Form.Select>
            </Form.Group>
        )
    })
    const ProductUnit = React.forwardRef((props, ref) => {
        return (
            <FormGroup as={Col} sm={12} md={6} controlId="formProductUnit">
                <Form.Label>Product Size <Form.Text><i> Unit size </i></Form.Text></Form.Label>
                <Form.Select ref={ref} defaultValue={product.unit ?? false} required name="product_size">
                    {size.map(function(size, index) {
                        return <option key={index} value={size.name}>{size.name}</option>
                    })}
                </Form.Select>
            </FormGroup>
        )
    })

    function ProductPackageSizeWrapper ( props ) {
        
        const ProductPackageUnits = React.forwardRef((props, ref) => {
            return (
                <>
                    <Form.Control ref={ref}
                        defaultValue={product.package_units ?? false} 
                        onChange={handleCalcUnitPriceChange} 
                        id="formProductPackageUnits" 
                        type="number" min="1" max="999"  
                        required name="product_package_units" />
                    <Form.Text>Package Units</Form.Text>
                </>
            )
        });

        const ProductPackageType = React.forwardRef((props, ref) => {
            return (
                <>
                    <Form.Select ref={ref} 
                        defaultValue={product.package_type ?? false} 
                        id="formProductPackageType" required 
                        name="product_package_size">
                            {package_size.map(function(size, index) {
                                return <option key={index} value={size.name}>{size.name}</option>
                            })}
                    </Form.Select>
                    <Form.Text>Package Type</Form.Text>
                </>
            )
        });

        return (
            <FormGroup as={Col} sm={12} md={6} >
                <Form.Label>Package Size</Form.Label>
                <Form.Text><i> &nbsp; (e.g. 24 per Case) </i></Form.Text>
                <Stack direction="horizontal">
                    <Col>
                        <ProductPackageUnits ref={productPackageUnitsInput} />
                    </Col>
                    <Col>
                        <ProductPackageType ref={productPackageTypeInput} />
                    </Col>
                </Stack>
            </FormGroup>
        )
    }

    const ProductDistrubutor = React.forwardRef((props, ref) => {
        return (
            <FormGroup as={Col} controlId="formGridProductDistributor">
                <Form.Label>Distributor</Form.Label>
                <Form.Select ref={ref} defaultValue={product.distributor ?? false} required name="product_distributor">
                    {product_distributor.map(function(size, index) {
                        return <option key={index} value={size.name}>{size.name}</option>
                    })}
                </Form.Select>
            </FormGroup>
        )
    });

    
    const ProductPackagePriceWrapper = function({ children, packageType, ...props }) {
        
        const ProductPackagePriceDollars = React.forwardRef((props, ref) => {
            return (
                <Form.Control 
                    ref={ref} 
                    defaultValue={ initPackagePriceDollars }
                    onChange={ handleCalcUnitPriceChange } 
                    onKeyPress={ handleDecimalButton }
                    type="number" step="1" id="package_price_dollars"/>
            )
        });

        const ProductPackagePriceCents = React.forwardRef((props, ref) => {
            return (
                <Form.Control 
                    ref={ref} 
                    defaultValue={ initPackagePriceCents }
                    onChange={ handleCalcUnitPriceChange } 
                    type="number" step="1" id="package_price_cents"
                />
            )
        });

        return (
            <FormGroup as={Col}>
                <Form.Label>Package Price</Form.Label>
                <Form.Text></Form.Text>
                <InputGroup className="mb-3">
                    <InputGroup.Text>$</InputGroup.Text>
                    <ProductPackagePriceDollars ref={packagePriceDollarsInput} />
                    <InputGroup.Text>.</InputGroup.Text>
                    <ProductPackagePriceCents ref={packagePriceCentsInput} />
                </InputGroup>
            </FormGroup>
        )
    };

    const ProductUnitPrice = React.forwardRef (( props, ref ) => {
        return (
            <FormGroup as={Col}>
                <Form.Label>Unit Price</Form.Label>
                <InputGroup className="mb-3">
                    <InputGroup.Text >Per unit</InputGroup.Text>
                    <Form.Control value={initUnitPrice()} disabled id="packagePricePerUnit" ref={ref}></Form.Control>
                </InputGroup>
            </FormGroup>
        )
    })

    function ModalWrapper ({ productName, show, hide, children, ...props }) {
        const [disableBtn, setDisableBtn] = useState(false);
        const [formFeedback, setFormFeedback] = useState("");
        function handleSaveChanges(e) {
            
            setDisableBtn(true);    
            const data          = { }
            data.name           = productNameInput.current.value;
            data.unit           = productUnitInput.current.value;
            data.category       = productCategoryInput.current.value;
            data.package_units  = productPackageUnitsInput.current.value;
            data.package_type   = productPackageTypeInput.current.value;
            data.package_price  = parseInt(packagePriceDollarsInput.current.value) + ( packagePriceCentsInput.current.value * .01 );
            data.distributor    = productDistributorInput.current.value;

            API.Products.editProduct( data )
                .then( response => {
                    console.log(response)
                    if( response.success ) {
                        window.location.href = "/products";
                    } else {
                        setFormFeedback( response.message );
                        setDisableBtn(false);
                    }
                }).catch( err => {
                    setFormFeedback("Error Saving Changes");
                    setDisableBtn(false);
                });
        }

        return (
            <Modal centered keyboard restoreFocus={false} size={"lg"} show={show} >
                <Modal.Header closeButton onHide={hide}>
                    <Modal.Title>
                        { productName ?? '' }
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control.Feedback>
                        { formFeedback ?? '' }
                    </Form.Control.Feedback>
                    {children}
                </Modal.Body>
                <Modal.Footer>
                    <Button disabled={ disableBtn } onClick={handleSaveChanges} variant="primary">
                        Save Changes
                    </Button>
                    <Button onClick={hide} variant="secondary">
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    return (
        <ModalWrapper show={show} hide={hide} productName={product?.name}>
             <FormWrapper>
                <Row className="mb-3">
                    <ProductName ref={productNameInput} />
                    <ProductCategory ref={productCategoryInput} />
                </Row>

                <Row className="mb-3">
                    <ProductUnit ref={productUnitInput} />
                    <ProductPackageSizeWrapper />
                </Row>

                <Row className="mb-3">
                    <ProductUnitPrice ref={unitPriceInput} />
                    <ProductPackagePriceWrapper packageType={ product?.package_type } />
                </Row>

                <Row className="mb-3">
                    <ProductDistrubutor ref={productDistributorInput} />
                </Row>
            </FormWrapper>
        </ModalWrapper>
    )
}

export default EditProductModal;

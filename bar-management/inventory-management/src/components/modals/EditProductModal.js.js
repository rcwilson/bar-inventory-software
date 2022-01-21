// import '../../App.css'
import React, { useEffect, useState, useRef, createRef } from 'react'
import { Row, Col, Form, FormGroup, Stack, InputGroup, Button } from 'react-bootstrap'
import { Modal } from 'react-bootstrap'
// import API from '../../api/API'

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

    const packagePriceDollarsRef        = useRef();
    const packagePriceCentsRef          = useRef();
    const packagePriceCentsRefPrevious  = useRef();
    const unitPriceRef = useRef();

    const productNameRef           = useRef();
    const productCategoryRef       = useRef();
    const productUnitRef           = useRef();
    const productPackageUnitsRef   = useRef();
    const productPackageTypeRef    = useRef();
    const productPackagePriceRef   = useRef({value: "0"});
    const productDistributorRef    = useRef();

    const [packageTypeLabel, setPackageTypeLabel] = useState('');
        useEffect(()=>{
            console.log("UseEffect: packageLabel")

            if( product ) {
                setPackageTypeLabel(` per ${product.package_type}`)
            }
        },[ product ]);

        function handlePackageTypeLabel() {
            setPackageTypeLabel(` per ${productPackageTypeRef.current.value}`)
        }

    const [initPackagePriceSplit, setInitPackagePriceSplit] = useState({dollars: 0, cents: 0})
        useEffect( () => {
            if (product && product.package_price) {
                function splitPackagePriceDecimal( price ) {
                    let splitPrice = price.toString().split('.');
                    let dollars = parseInt(splitPrice[0]);
                    let cents = parseInt(splitPrice[1] ?? 0);
                    setInitPackagePriceSplit({ dollars, cents });
                }
                splitPackagePriceDecimal( product.package_price );
            }
        }, [ product ]);

        useEffect( () => {
            if( product && product.package_price && product.package_units ) {
                console.log("UseEffect: unitPriceRef", unitPriceRef);
                unitPriceRef.current.value = calcUnitPrice({ price: product.package_price, units: product.package_units });
            }
        }, [ product ]);
  
        function calcUnitPrice ({ dollars, cents, price, units }) {
            console.log(`calcUnitPrice: dollars: ${dollars}, cents: ${cents}, price: ${price}, units: ${units}`)
            if( dollars !== undefined && cents !== undefined ) {
                return ((dollars + cents) / units).toFixed(2);
            } else {
                return (price / units).toFixed(2);
            }
        }
        function handleCalcUnitPriceChange() {

            const dollars   = parseInt(packagePriceDollarsRef.current['value']);
            const cents     = 0.01 * parseInt(packagePriceCentsRef.current['value']);
            const price     = dollars + cents;
            const units     = parseInt(productPackageUnitsRef.current['value']);
            const amount    = (price / units).toFixed(2);
            console.log('handleCalcUnitPrice', {dollars, cents, units, amount}, `${typeof dollars}, ${typeof cents}, ${typeof units}, ${typeof amount}`)
            unitPriceRef.current.value =  amount;
            console.log('handleCalcUnitPrice', {dollars, cents, units, amount}, `${typeof dollars}, ${typeof cents}, ${typeof units}, ${typeof amount}`)
        }
        
    function validateNumberInput(e) {
        console.log("validateNumberInput")
        const self = e.target;
        
        if(self.value.length > 2) {self.value = packagePriceCentsRefPrevious.current;}
        else {packagePriceCentsRefPrevious.current = self.value;}
    }
    function handleDecimalButton(e) {
        console.log("handleDecimalButton")
        if(e.key === '.'){ 
            console.log('handleDecimalButton', e.key, e.key === '.')
            e.preventDefault();
            if(e.target === packagePriceDollarsRef.current) packagePriceCentsRef.current.focus();
        }
    }
    function handleFocus(e)
    {
        e.target.select();
        if(e.target.value === "00") e.target.value = "";
    }
    function handleFocusOut(e)
    {
        let input      = e.target
        let inputValue = e.target.value;

        if(inputValue === "") input.value = "00";
        else if(input === packagePriceCentsRef.current) {
            input.value = ('0' + inputValue).slice(-2);
        }
    }

    function ModalWrapper ({ product, show, hide, children, ...props }) {
        return (
            <Modal centered keyboard restoreFocus={false} size={"lg"} show={show} >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {product ? product.name : ''}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {children}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={hide} variant="secondary">
                        Cancel
                    </Button>
                    <Button variant="primary">
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        )
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

    const ProductPackageUnits = React.forwardRef((props, ref) => {
        return (
            <><Form.Control ref={ref}
                defaultValue={product.package_units ?? false} 
                onChange={handleCalcUnitPriceChange} 
                id="formProductPackageUnits" 
                type="number" min="1" max="999"  
                required name="product_package_units" />
            <Form.Text>Package Units</Form.Text></>
        )
    });

    const ProductPackageType = React.forwardRef((props, ref) => {
        return (
            <>
                <Form.Select ref={ref} 
                    defaultValue={product.package_type ?? false} 
                    onChange={handlePackageTypeLabel} 
                    id="formProductPackageType" required 
                    name="product_package_size">
                        {package_size.map(function(size, index) {
                            return <option key={index} value={size.name}>{size.name}</option>
                        })}
                </Form.Select>
                <Form.Text>Package Type</Form.Text>
            </>
        )
    })

    function ProductPackageSizeWrapper ( props ) {
        return (
            <FormGroup as={Col} sm={12} md={6} >
                <Form.Label>Package Size</Form.Label>
                <Form.Text><i> &nbsp; (e.g. 24 per Case) </i></Form.Text>
                <Stack direction="horizontal">
                    <Col>
                        <ProductPackageUnits ref={productPackageUnitsRef} />
                    </Col>
                    <Col>
                        <ProductPackageType ref={productPackageTypeRef} />
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

    const ProductPackagePriceDollars = React.forwardRef((props, ref) => {
        return (
            <Form.Control 
                ref={ref} 
                defaultValue={initPackagePriceSplit.dollars}
                // onKeyPress={handleDecimalButton} 
                onChange={handleCalcUnitPriceChange} 
                type="number" step="1" id="package_price_dollars"/>
        )
    });

    const ProductPackagePriceCents = React.forwardRef((props, ref) => {
        return (
            <Form.Control 
                ref={ref} 
                defaultValue={initPackagePriceSplit.cents}
                // onKeyPress={handleDecimalButton} 
                onChange={handleCalcUnitPriceChange} 
                type="number" step="1" id="package_price_cents"/>
        )
    })
    
    const ProductPackagePriceWrapper = React.memo(({ children, state, ...props }) => {
        return (
            <FormGroup as={Col}>
                <Form.Label>Package Price</Form.Label>
                <Form.Text><i> &nbsp; { state } </i></Form.Text>
                <InputGroup className="mb-3">
                    <InputGroup.Text>$</InputGroup.Text>
                    <ProductPackagePriceDollars ref={packagePriceDollarsRef} />
                    <InputGroup.Text>.</InputGroup.Text>
                    <ProductPackagePriceCents ref={packagePriceCentsRef} />
                </InputGroup>
            </FormGroup>
        )
    })

    const ProductUnitPrice = React.forwardRef (( props, ref ) => {
        return (
            <FormGroup as={Col}>
                <Form.Label>Unit Price</Form.Label>
                <InputGroup className="mb-3">
                    <InputGroup.Text >Per unit</InputGroup.Text>
                    <Form.Control readOnly id="packagePricePerUnit" ref={ref}></Form.Control>
                </InputGroup>
            </FormGroup>
        )
    })

    return (
        <ModalWrapper show={show} hide={hide}>
             <FormWrapper>
                <Row className="mb-3">
                    <ProductName ref={productNameRef} />
                    <ProductCategory ref={productCategoryRef} />
                </Row>

                <Row className="mb-3">
                    <ProductUnit ref={productUnitRef} />
                    <ProductPackageSizeWrapper />
                </Row>

                <Row className="mb-3">
                    <ProductUnitPrice ref={unitPriceRef} />
                    <ProductPackagePriceWrapper state={packageTypeLabel} />
                </Row>
                <Row className="mb-3">
                    <ProductDistrubutor ref={productDistributorRef} />
                </Row>
            </FormWrapper>
        </ModalWrapper>
    )
}
function areEqual(prevProps, nextProps) {
    return prevProps === nextProps;
}
// export default React.memo(EditProductModal, areEqual);
export default EditProductModal;

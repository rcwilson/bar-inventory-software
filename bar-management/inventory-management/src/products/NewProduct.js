import '../App.css'
import React, { useEffect, useState, useRef } from 'react'
import { Row, Col, Form, FormGroup, Stack, InputGroup, Button } from 'react-bootstrap'
import API from '../api/API'

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

export default function NewProductPage() {

    async function submitData() {
        
        const form = document.getElementById("newProductForm");
        if(form.checkValidity() === false) return {success: false}

        const name          = document.getElementById("formProductName")?.value
        const category      = document.getElementById("formProductCategory")?.value
        const unit          = document.getElementById("formProductUnit")?.value
        const package_units = document.getElementById("formProductPackageUnits")?.value
        const package_type  = document.getElementById("formProductPackageType")?.value
        const package_price = packagePriceDollarsRef.current.value + (packagePriceCentsRef.current.value * .01)
        const distributor   = document.getElementById('formGridProductDistributor')?.value
        const result = await API.Products.addProduct({
            name, category, unit, package_type, package_units, package_price, distributor
        })

        return result;    
    }

    function LoadingButton() {
        const [isLoading, setLoading] = useState(false);

        useEffect(() => {
            if (isLoading) {
                submitData()
                .then(res=>{
                    console.log("sumbit result: ", res)
                    if(res.success){
                        window.location = '/products';
                    } else {
                        setLoading(false)
                        console.error(res)
                    }
                })
            }
        }, [isLoading])
        
        const handleSubmit = () => {
            setLoading(true);
            };

        return (
            <Button type="submit" disabled={isLoading} onClick={!isLoading ? handleSubmit : null}>
                {isLoading ? "Submitting..." : "Add New Product"}
            </Button>
        )
    }


    const [validated, setValidated] = useState(false);
    const [unitPrice, setUnitPrice]   = useState("0.00");
    const [productPackageType, setProductPackageType] = useState("PACKAGE TYPE")
    const [productUnitType, setProductUnitType]       = useState("UNIT TYPE")
    useEffect(()=>{
        setProductUnitType(document.getElementById('formProductUnit').value)
        setProductPackageType(document.getElementById('formProductPackageType').value)
    },[])

    const packagePriceDollarsRef        = useRef();
    const packagePriceCentsRef          = useRef();
    const packagePriceCentsRefPrevious  = useRef();
    const orderSizeUnits                = useRef();

    function handleChangePackageType(e) {
        setProductPackageType(e.target.value)
    }
    function handleChangeUnitType(e) {
        setProductUnitType(e.target.value)
    }
    function handlePackagePriceChange() {
        const priceDollars    = parseInt(packagePriceDollarsRef.current['value'])
        const priceCents      = 0.01 * parseInt(packagePriceCentsRef.current['value'])
        const orderUnits      = parseInt(orderSizeUnits.current['value'] ?? 1);
        const calcUnitPrice   = (dollars, cents, units) => {
            return (dollars + cents) / units;
        }
        setUnitPrice(calcUnitPrice(priceDollars, priceCents, orderUnits).toFixed(2))
    }
    function validateNumberInput(e) {
        const self = e.target;
        
        if(self.value.length > 2) {self.value = packagePriceCentsRefPrevious.current;}
        else {packagePriceCentsRefPrevious.current = self.value;}
    }
    function handleDecimalButton(e) {
        if(e.key === '.'){ 
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
    
    return (
        <Form noValidate validated={validated} id="newProductForm" className="p-4 bg-white shadow">
            <Row className="text-center mb-4">
                <h1>New Product</h1>
            </Row>

            <Row className="mb-3">
                <Form.Group as={Col} sm={12} md={6} controlId="formProductName">
                    <Form.Label aria-label="Product Name" title="Product Name">Product name</Form.Label>
                    <Form.Control required name="product_name" autoComplete="off" type="text"></Form.Control>
                </Form.Group>

                <Form.Group as={Col} sm={12} md={6} controlId="formProductCategory">
                    <Form.Label>Product Category</Form.Label>
                    <Form.Select required name="product_category">
                        {categories.map(function(category, index) {
                            return <option key={index} value={category.name}>{category.name}</option>
                        })}
                    </Form.Select>
                </Form.Group>
            </Row>

            <Row className="mb-3">
                <FormGroup as={Col} sm={12} md={6} controlId="formProductUnit">
                    <Form.Label>Product Size (Unit)</Form.Label>
                    <Form.Select onChange={handleChangeUnitType} required name="product_size">
                        {size.map(function(size, index) {
                            return <option key={index} value={size.name}>{size.name}</option>
                        })}
                    </Form.Select>
                </FormGroup>

                <FormGroup as={Col} sm={12} md={6} >
                        <Form.Label>Package Size</Form.Label>
                        <Form.Text><i> &nbsp; (e.g. 24 per Case) </i></Form.Text>
                        <Stack direction="horizontal">
                            <Col>
                                <Form.Control id="formProductPackageUnits" onChange={handlePackagePriceChange} type="number" min="1" max="999" defaultValue={1} ref={orderSizeUnits} required name="product_package_units" />
                                <Form.Text>Units</Form.Text>
                            </Col>
                            
                            <Col>
                                <Form.Select onChange={handleChangePackageType} id="formProductPackageType" required name="product_package_size">
                                    {package_size.map(function(size, index) {
                                        return <option key={index} value={size.name}>{size.name}</option>
                                    })}
                                </Form.Select>
                                <Form.Text>Package Type</Form.Text>
                            </Col>
                        </Stack>
                </FormGroup>
            </Row>

            <Row className="mb-3">
                <FormGroup as={Col}>
                    <Form.Label>Package Price</Form.Label>
                    <Form.Text><i> &nbsp; {productPackageType} price </i></Form.Text>

                    <InputGroup className="mb-3">
                        <InputGroup.Text>$</InputGroup.Text>
                        <Form.Control onBlur={handleFocusOut} onFocus={handleFocus} onKeyPress={handleDecimalButton} onChange={handlePackagePriceChange} ref={packagePriceDollarsRef} defaultValue="00" type="number" step="1" id="package_price_dollars"/>
                        <InputGroup.Text>.</InputGroup.Text>
                        <Form.Control onBlur={handleFocusOut} onFocus={handleFocus} onKeyPress={handleDecimalButton} onInput={validateNumberInput} onChange={handlePackagePriceChange} ref={packagePriceCentsRef} defaultValue="00" type="number" max="99" step="1" id="package_price_cents"/>
                    </InputGroup>
                </FormGroup>

                <FormGroup as={Col}>
                    <Form.Label>Unit Price</Form.Label>
                    <Form.Text><i> &nbsp; {productUnitType} price </i></Form.Text>

                    <InputGroup className="mb-3">
                        <InputGroup.Text >Per unit</InputGroup.Text>
                        <Form.Control readOnly id="packagePricePerUnit" value={unitPrice}></Form.Control>
                    </InputGroup>
                </FormGroup>
            </Row>

            <Row className="mb-3">
                <FormGroup as={Col} controlId="formGridProductDistributor">
                    <Form.Label>Distributor</Form.Label>
                    <Form.Select required name="product_distributor">
                        {product_distributor.map(function(size, index) {
                            return <option key={index} value={size.name}>{size.name}</option>
                        })}
                    </Form.Select>
                </FormGroup>
            </Row>
            
            <Row className="mb-3 mt-5">
                <LoadingButton />
            </Row>
        </Form>
    )
}

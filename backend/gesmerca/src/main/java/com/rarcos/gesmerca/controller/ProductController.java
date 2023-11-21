package com.rarcos.gesmerca.controller;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rarcos.gesmerca.assemblers.ProductModelAssembler;
import com.rarcos.gesmerca.dto.Message;
import com.rarcos.gesmerca.dto.ProductDto;
import com.rarcos.gesmerca.entity.Product;
import com.rarcos.gesmerca.model.ProductModel;
import com.rarcos.gesmerca.service.ProductService;

import io.micrometer.common.util.StringUtils;

@RestController
@RequestMapping("/api/product")
@CrossOrigin(origins = "*") // En desarrollo acepta cualquier URL. TODO: cambiar a dominio producción.
public class ProductController {

    @Autowired
    ProductService productService;

    @Autowired
    private ProductModelAssembler productModelAssembler;

    @Autowired
    private PagedResourcesAssembler<Product> pagedResourcesAssembler;

    @GetMapping
    public ResponseEntity<PagedModel<ProductModel>> listPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size,
            @RequestParam(defaultValue = "") List<String> sortList,
            @RequestParam(defaultValue = "DESC") Sort.Direction sortOrder) {
        // create Pageable object using the page, size and sort details
        Pageable pageable = PageRequest.of(page, size, Sort.by(createSortOrder(sortList, sortOrder.toString())));
        // Use the pagedResourcesAssembler and productModelAssembler to convert data to
        // PagedModel format
        Page<Product> productPage = productService.listPaginated(pageable);
        PagedModel<ProductModel> pagedModel = pagedResourcesAssembler.toModel(productPage, productModelAssembler);
        return new ResponseEntity<>(pagedModel, HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Product>> list() {
        List<Product> list = productService.list();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getById(@PathVariable("id") Long id) {
        if (!productService.existsById(id))
            return new ResponseEntity<>(new Message("No existe un producto para id dado"), HttpStatus.NOT_FOUND);
        Product product = productService.getOne(id).get();
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<Object> getByName(@PathVariable("name") String name) {
        if (!productService.existsByName(name))
            return new ResponseEntity<>(new Message("No existe un producto para el nombre dado"), HttpStatus.NOT_FOUND);
        Product product = productService.getOneByName(name).get(0);
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody ProductDto productDto) {
        if (StringUtils.isBlank(productDto.getName()))
            return new ResponseEntity<>(new Message("El producto debe de tener un nombre"), HttpStatus.BAD_REQUEST);
        if (productDto.getPrice() == null || productDto.getPrice() <= 0)
            return new ResponseEntity<>(new Message("El producto debe de tener un precio mayor a 0"),
                    HttpStatus.BAD_REQUEST);
        if (productService.existsByName(productDto.getName()))
            return new ResponseEntity<>(new Message("El nombre del producto ya existe"), HttpStatus.BAD_REQUEST);
        Product product = new Product(productDto.getName(), productDto.getDescription(), productDto.getSupplier(),
                productDto.getImage(), productDto.getThumbail_64x64(), productDto.getThumbail_128x128(),
                productDto.getPrice(), productDto.getStock(), productDto.getCreatedAt(), productDto.getUpdatedAt());
        productService.save(product);
        return new ResponseEntity<>(new Message("El producto se ha creado correctamente"), HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable("id") Long id, @RequestBody ProductDto productDto) {
        if (!productService.existsById(id))
            return new ResponseEntity<>(new Message("No existe un producto para id dado"), HttpStatus.NOT_FOUND);
        if (productService.existsByName(productDto.getName())
                && productService.getOneByName(productDto.getName()).get(0).getId() != id)
            return new ResponseEntity<>(new Message("El nombre del producto ya existe"), HttpStatus.BAD_REQUEST);
        if (StringUtils.isBlank(productDto.getName()))
            return new ResponseEntity<>(new Message("El producto debe de tener un nombre"), HttpStatus.BAD_REQUEST);
        if (productDto.getPrice() == null || productDto.getPrice() <= 0)
            return new ResponseEntity<>(new Message("El producto debe de tener un precio mayor a 0"),
                    HttpStatus.BAD_REQUEST);
        Product product = productService.getOne(id).get();
        product.setName(productDto.getName());
        product.setDescription(productDto.getDescription());
        product.setImage(productDto.getImage());
        product.setPrice(productDto.getPrice());
        product.setStock(productDto.getStock());
        product.setThumbail_128x128(productDto.getThumbail_128x128());
        product.setThumbail_64x64(productDto.getThumbail_64x64());
        product.setUpdatedAt(productDto.getUpdatedAt());
        productService.save(product);
        return new ResponseEntity<>(new Message("El producto se ha actualizado correctamente"), HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        if (!productService.existsById(id))
            return new ResponseEntity<>(new Message("No existe un producto para id dado"), HttpStatus.NOT_FOUND);
        productService.delete(id);
        return new ResponseEntity<>(new Message("El producto se ha eliminado correctamente"), HttpStatus.OK);
    }

    private List<Sort.Order> createSortOrder(List<String> sortList, String sortDirection) {
        List<Sort.Order> sorts = new ArrayList<>();
        Sort.Direction direction;
        for (String sort : sortList) {
            if (sortDirection != null) {
                direction = Sort.Direction.fromString(sortDirection);
            } else {
                direction = Sort.Direction.DESC;
            }
            sorts.add(new Sort.Order(direction, sort));
        }
        return sorts;
    }
}
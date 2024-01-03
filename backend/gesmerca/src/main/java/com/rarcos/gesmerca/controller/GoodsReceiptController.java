package com.rarcos.gesmerca.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.rarcos.gesmerca.assemblers.GoodsReceiptModelAssembler;
import com.rarcos.gesmerca.dto.Message;
import com.rarcos.gesmerca.dto.PriceEstimatedDto;
import com.rarcos.gesmerca.dto.Error;
import com.rarcos.gesmerca.dto.GoodsReceiptDto;
import com.rarcos.gesmerca.dto.GoodsReceiptDtoRequest;
import com.rarcos.gesmerca.dto.GoodsReceiptProductDto;
import com.rarcos.gesmerca.dto.GoodsReceiptProductDtoRequest;
import com.rarcos.gesmerca.dto.GoodsReceiptProductDtoRequestDelete;
import com.rarcos.gesmerca.entity.GoodsReceipt;
import com.rarcos.gesmerca.entity.GoodsReceiptProduct;
import com.rarcos.gesmerca.entity.Product;
import com.rarcos.gesmerca.model.GoodsReceiptModel;
import com.rarcos.gesmerca.security.service.UserService;
import com.rarcos.gesmerca.service.GoodsReceiptService;
import com.rarcos.gesmerca.service.ProductService;
import com.rarcos.gesmerca.service.SupplierService;

import io.micrometer.common.util.StringUtils;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/goodsreceipt")
@CrossOrigin(origins = "*") // En desarrollo acepta cualquier URL. TODO: cambiar a dominio producción.
public class GoodsReceiptController {

    @Autowired
    GoodsReceiptService goodsReceiptService;

    @Autowired
    ProductService productService;

    @Autowired
    SupplierService supplierService;

    @Autowired
    UserService userService;

    @Autowired
    private GoodsReceiptModelAssembler goodsReceiptModelAssembler;

    @Autowired
    private PagedResourcesAssembler<GoodsReceipt> pagedResourcesAssembler;

    @GetMapping
    public ResponseEntity<PagedModel<GoodsReceiptModel>> listPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size,
            @RequestParam(defaultValue = "updatedAt") List<String> sortList,
            @RequestParam(defaultValue = "DESC") Sort.Direction sortOrder) {
        // create Pageable object using the page, size and sort details
        Pageable pageable = PageRequest.of(page, size, Sort.by(createSortOrder(sortList, sortOrder.toString())));
        // Use the pagedResourcesAssembler and productModelAssembler to convert data to
        // PagedModel format
        Page<GoodsReceipt> goodsReceiptPage = goodsReceiptService.listPaginated(pageable);
        PagedModel<GoodsReceiptModel> pagedModel = pagedResourcesAssembler.toModel(goodsReceiptPage,
                goodsReceiptModelAssembler);
        return new ResponseEntity<>(pagedModel, HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<GoodsReceipt>> list() {
        List<GoodsReceipt> list = goodsReceiptService.list();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @GetMapping("/allbysupplier/{idSupplier}")
    public ResponseEntity<PagedModel<GoodsReceiptModel>> listPaginationBySupplier(
            @PathVariable("idSupplier") Long idSupplier,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size,
            @RequestParam(defaultValue = "updatedAt") List<String> sortList,
            @RequestParam(defaultValue = "DESC") Sort.Direction sortOrder) {
        // create Pageable object using the page, size and sort details
        Pageable pageable = PageRequest.of(page, size, Sort.by(createSortOrder(sortList, sortOrder.toString())));
        // Use the pagedResourcesAssembler and productModelAssembler to convert data to
        // PagedModel format
        Page<GoodsReceipt> goodsReceiptPage = goodsReceiptService
                .listPaginatedBySupplier(supplierService.getOne(idSupplier).get(), pageable);
        PagedModel<GoodsReceiptModel> pagedModel = pagedResourcesAssembler.toModel(goodsReceiptPage,
                goodsReceiptModelAssembler);
        return new ResponseEntity<>(pagedModel, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getById(@PathVariable("id") Long id) {
        if (!goodsReceiptService.existsById(id))
            return new ResponseEntity<>(new Error("No existe un albarán para id dado"), HttpStatus.NOT_FOUND);
        GoodsReceiptDto goodsReceipt = new GoodsReceiptDto(
                goodsReceiptService.getOne(id).get().getId(),
                goodsReceiptService.getOne(id).get().getSupplier().getId(),
                goodsReceiptService.getOne(id).get().getSupplier().getName(),
                goodsReceiptService.getOne(id).get().getUser().getId(),
                goodsReceiptService.getOne(id).get().getUser().getName(),
                goodsReceiptService.getOne(id).get().getDate().toString(),
                goodsReceiptService.getOne(id).get().getTime().toString(),
                goodsReceiptService.getOne(id).get().getDocnum(),
                goodsReceiptService.getOne(id).get().getCreatedAt(),
                goodsReceiptService.getOne(id).get().getUpdatedAt());
        return new ResponseEntity<>(goodsReceipt, HttpStatus.OK);
    }

    @GetMapping("/{id}/products")
    public ResponseEntity<Object> getByIdProducts(@PathVariable("id") Long id) {
        if (!goodsReceiptService.existsById(id))
            return new ResponseEntity<>(new Error("No existe un albarán para el id dado"), HttpStatus.NOT_FOUND);
        List<GoodsReceiptProduct> goodsReceiptProducts = goodsReceiptService
                .getGoodsReceiptProduct(goodsReceiptService.getOne(id).get());
        List<GoodsReceiptProductDto> goodsReceiptProductsDto = new ArrayList<>();
        for (GoodsReceiptProduct goodsReceiptProduct : goodsReceiptProducts) {
            goodsReceiptProductsDto.add(new GoodsReceiptProductDto(
                    goodsReceiptProduct.getId(),
                    goodsReceiptProduct.getGoodsReceipt().getId(),
                    goodsReceiptProduct.getProduct().getId(),
                    goodsReceiptProduct.getProduct().getName(),
                    goodsReceiptProduct.getQuantity(),
                    goodsReceiptProduct.getPrice(),
                    goodsReceiptProduct.getCreatedAt(),
                    goodsReceiptProduct.getUpdatedAt()));
        }
        return new ResponseEntity<>(goodsReceiptProductsDto, HttpStatus.OK);
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@ModelAttribute GoodsReceiptDtoRequest goodsReceiptDto) {
        if (StringUtils.isBlank(goodsReceiptDto.getDocnum()))
            return new ResponseEntity<>(new Error("El albarán debe de tener un número de documento"),
                    HttpStatus.BAD_REQUEST);
        if (goodsReceiptService.existsByDocnumAndSupplier(goodsReceiptDto.getDocnum(),
                supplierService.getOne(goodsReceiptDto.getIdSupplier()).get()))
            return new ResponseEntity<>(new Error("El número de documento del albarán ya existe"),
                    HttpStatus.BAD_REQUEST);
        GoodsReceipt goodsReceipt = new GoodsReceipt(
                supplierService.getOne(goodsReceiptDto.getIdSupplier()).get(),
                userService.getById(goodsReceiptDto.getIdUser()).get(),
                goodsReceiptDto.getDate(),
                goodsReceiptDto.getTime(),
                goodsReceiptDto.getDocnum(),
                ZonedDateTime.now(), ZonedDateTime.now());
        GoodsReceipt newGoodReceipt = goodsReceiptService.save(goodsReceipt);
        return new ResponseEntity<>(newGoodReceipt, HttpStatus.OK);
    }

    @PutMapping("/{id}/product/add")
    public ResponseEntity<Object> addProduct(@PathVariable("id") Long id,
            @Valid @ModelAttribute GoodsReceiptProductDtoRequest goodsReceiptProductDtoReq) {
        if (!goodsReceiptService.existsById(id))
            return new ResponseEntity<>(new Error("No existe un albarán para el id dado"), HttpStatus.NOT_FOUND);
        GoodsReceipt goodsReceipt = goodsReceiptService.getOne(id).get();
        Product product = productService.getOne(goodsReceiptProductDtoReq.getIdProduct()).get();
        GoodsReceiptProduct goodsReceiptProduct = new GoodsReceiptProduct(goodsReceipt, product,
                goodsReceiptProductDtoReq.getQuantity(), goodsReceiptProductDtoReq.getPrice(),
                goodsReceiptProductDtoReq.getCreatedAt(), goodsReceiptProductDtoReq.getUpdatedAt());
        product.setStock(product.getStock() + goodsReceiptProductDtoReq.getQuantity());
        productService.save(product);
        goodsReceiptService.save(goodsReceiptProduct);
        return new ResponseEntity<>(new Message("El producto se ha añadido al albarán"), HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable("id") Long id,
            @Valid @ModelAttribute GoodsReceiptDto goodsReceiptDto) {
        if (StringUtils.isBlank(goodsReceiptDto.getDocnum()))
            return new ResponseEntity<>(new Error("El albarán debe de tener un número de documento"),
                    HttpStatus.BAD_REQUEST);
        GoodsReceipt goodsReceipt = goodsReceiptService.getOne(goodsReceiptDto.getId()).get();
        goodsReceipt.setDocnum(goodsReceiptDto.getDocnum());
        goodsReceipt.setUser(userService.getById(goodsReceiptDto.getIdUser()).get());
        goodsReceipt.setSupplier(supplierService.getOne(goodsReceiptDto.getIdSupplier()).get());
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
        goodsReceipt.setDate(LocalDate.parse(goodsReceiptDto.getDate(), formatter));
        goodsReceipt.setTime(LocalTime.parse(goodsReceiptDto.getTime()));
        goodsReceipt.setUpdatedAt(ZonedDateTime.now());
        goodsReceiptService.save(goodsReceipt);
        return new ResponseEntity<>(new Message("El albarán se ha actualizado correctamente"), HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        if (!goodsReceiptService.existsById(id))
            return new ResponseEntity<>(new Error("No existe un albarán para id dado"), HttpStatus.NOT_FOUND);
        goodsReceiptService.delete(id);
        return new ResponseEntity<>(new Message("El albarán se ha eliminado correctamente"), HttpStatus.OK);
    }

    @PutMapping("/{id}/product/delete")
    public ResponseEntity<Object> deleteProduct(@PathVariable("id") Long id,
            @Valid @ModelAttribute GoodsReceiptProductDtoRequestDelete goodsReceiptProductDtoReq) {
        if (!goodsReceiptService.existsById(id))
            return new ResponseEntity<>(new Error("No existe un albarán para el id dado"), HttpStatus.NOT_FOUND);
        Product product = productService.getOne(goodsReceiptProductDtoReq.getIdGoodsReceiptProduct()).get();
        product.setStock(product.getStock() - goodsReceiptProductDtoReq.getQuantity());
        productService.save(product);
        goodsReceiptService.deleteGoodsReceiptProduct(goodsReceiptProductDtoReq.getIdGoodsReceiptProduct());
        return new ResponseEntity<>(new Message("El producto se ha eliminado del albarán"), HttpStatus.OK);
    }

    @PostMapping("/getPriceEst")
    public ResponseEntity<Object> getPriceEst(@Valid @ModelAttribute PriceEstimatedDto priceEstimatedDto) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
            String jsonReq = "{\"idproduct\": " + Integer.valueOf(priceEstimatedDto.getIdProduct()) + ", \"quantity\": "
                    + Integer.valueOf(priceEstimatedDto.getQuantity()) + "}";
            HttpEntity<String> entity = new HttpEntity<>(jsonReq, headers);
            String uri = "https://vps.rarcos.com:10450";
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.POST, entity,
                    String.class);
            return new ResponseEntity<>(response.getBody(), HttpStatus.OK);
        } catch (NumberFormatException e) {
            return new ResponseEntity<>("0", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
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
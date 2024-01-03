package com.rarcos.gesmerca.controller;

import java.time.ZonedDateTime;
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
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rarcos.gesmerca.assemblers.SupplierModelAssembler;
import com.rarcos.gesmerca.dto.Message;
import com.rarcos.gesmerca.dto.Error;
import com.rarcos.gesmerca.dto.SupplierDto;
import com.rarcos.gesmerca.dto.SupplierDtoRequest;
import com.rarcos.gesmerca.entity.Supplier;
import com.rarcos.gesmerca.model.SupplierModel;
import com.rarcos.gesmerca.service.SupplierService;

import io.micrometer.common.util.StringUtils;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/supplier")
@CrossOrigin(origins = "*") // En desarrollo acepta cualquier URL. TODO: cambiar a dominio producción.
public class SupplierController {

    @Autowired
    SupplierService supplierService;

    @Autowired
    private SupplierModelAssembler supplierModelAssembler;

    @Autowired
    private PagedResourcesAssembler<Supplier> pagedResourcesAssembler;

    @GetMapping
    public ResponseEntity<PagedModel<SupplierModel>> listPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size,
            @RequestParam(defaultValue = "updatedAt") List<String> sortList,
            @RequestParam(defaultValue = "DESC") Sort.Direction sortOrder) {
        // create Pageable object using the page, size and sort details
        Pageable pageable = PageRequest.of(page, size, Sort.by(createSortOrder(sortList, sortOrder.toString())));
        // Use the pagedResourcesAssembler and productModelAssembler to convert data to
        // PagedModel format
        Page<Supplier> productPage = supplierService.listPaginated(pageable);
        PagedModel<SupplierModel> pagedModel = pagedResourcesAssembler.toModel(productPage, supplierModelAssembler);
        return new ResponseEntity<>(pagedModel, HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Supplier>> list() {
        List<Supplier> list = supplierService.list();
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getById(@PathVariable("id") Long id) {
        if (!supplierService.existsById(id))
            return new ResponseEntity<>(new Message("No existe un proveedor para id dado"), HttpStatus.NOT_FOUND);
        Supplier supplier = supplierService.getOne(id).get();
        return new ResponseEntity<>(supplier, HttpStatus.OK);
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<Object> getByName(@PathVariable("name") String name) {
        if (!supplierService.existsByName(name))
            return new ResponseEntity<>(new Error("No existe un proveedor para el nombre dado"),
                    HttpStatus.NOT_FOUND);
        Supplier supplier = supplierService.getOneByName(name).get(0);
        return new ResponseEntity<>(supplier, HttpStatus.OK);
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@ModelAttribute SupplierDtoRequest supplierDto) {
        if (StringUtils.isBlank(supplierDto.getName()))
            return new ResponseEntity<>(new Error("El proveedor debe de tener un nombre"), HttpStatus.BAD_REQUEST);
        if (supplierService.existsByName(supplierDto.getName()))
            return new ResponseEntity<>(new Error("El nombre del proveedor ya existe"), HttpStatus.BAD_REQUEST);
        if (StringUtils.isBlank(supplierDto.getCifNif()))
            return new ResponseEntity<>(new Error("El proveedor debe de tener un CIF/NIF"), HttpStatus.BAD_REQUEST);
        if (supplierService.existsByCifNif(supplierDto.getCifNif()))
            return new ResponseEntity<>(new Error("El CIF/NIF del proveedor ya existe"), HttpStatus.BAD_REQUEST);
        Supplier supplier = new Supplier(supplierDto.getCifNif(), supplierDto.getName(), supplierDto.getAddress(),
                supplierDto.getCity(), supplierDto.getPhone(), supplierDto.getEmail(), supplierDto.getWeb(),
                supplierDto.getNotes(), ZonedDateTime.now(), ZonedDateTime.now());
        supplierService.save(supplier);
        return new ResponseEntity<>(new Message("El proveedor se ha creado correctamente"), HttpStatus.OK);
    }

    @PutMapping("/update")
    public ResponseEntity<?> update(@Valid @ModelAttribute SupplierDto supplierDto) {
        if (!supplierService.existsById(supplierDto.getId()))
            return new ResponseEntity<>(new Error("No existe un proveedor para id dado"), HttpStatus.NOT_FOUND);
        if (StringUtils.isBlank(supplierDto.getName()))
            return new ResponseEntity<>(new Error("El proveedor debe de tener un nombre"), HttpStatus.BAD_REQUEST);
        if (StringUtils.isBlank(supplierDto.getCifNif()))
            return new ResponseEntity<>(new Error("El proveedor debe de tener un CIF/NIF"), HttpStatus.BAD_REQUEST);
        Supplier supplier = supplierService.getOne(supplierDto.getId()).get();
        supplier.setCifNif(supplierDto.getCifNif());
        supplier.setName(supplierDto.getName());
        supplier.setAddress(supplierDto.getAddress());
        supplier.setCity(supplierDto.getCity());
        supplier.setPhone(supplierDto.getPhone());
        supplier.setEmail(supplierDto.getEmail());
        supplier.setWeb(supplierDto.getWeb());
        supplier.setNotes(supplierDto.getNotes());
        supplier.setCreatedAt(supplierDto.getCreatedAt());
        supplier.setUpdatedAt(supplierDto.getUpdatedAt());
        supplierService.save(supplier);
        return new ResponseEntity<>(new Message("El proveedor se ha actualizado correctamente"), HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        if (!supplierService.existsById(id))
            return new ResponseEntity<>(new Error("No existe un proveedor para id dado"), HttpStatus.NOT_FOUND);
        supplierService.delete(id);
        return new ResponseEntity<>(new Message("El proveedor se ha eliminado correctamente"), HttpStatus.OK);
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
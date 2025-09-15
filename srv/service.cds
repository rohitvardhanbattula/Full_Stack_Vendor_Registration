type approverinput {
    name    : String(100);
    email   : String(200);
    country : String(50);
    level   : Integer;
}

type SupplierInput {
    supplierName      : String(200);
    status: String(100);
    businessPartnerId   : String;
    mainAddress       : AddressInput;
    primaryContact    : ContactInput;
    categoryAndRegion : CategoryRegionInput;
    additionalInfo    : AdditionalInfoInput;
}

type AddressInput {
    street     : String(200);
    line2      : String(200);
    line3      : String(200);
    city       : String(100);
    postalCode : String(20);
    country    : String(100);
    region     : String(100);
}

type ContactInput {
    firstName : String(100);
    lastName  : String(100);
    email     : String(200);
    phone     : String(50);
}

type CategoryRegionInput {
    category : String(100);
    region   : String(100);
}

type AdditionalInfoInput {
    details : String(100);
}

service SupplierService {

    function getsuppliers()                                       returns array of SupplierInput;
    function Approvers()                                          returns array of approverinput;

    action   approverentry(approverentry: approverinput)          returns String;
    action   approverupdateentry(approverentry: approverinput)          returns String;
    action   createSupplierWithFiles(supplierData: SupplierInput) returns String;

    function downloadAttachments(supplierName: String)            returns array of {
        fileName : String;
        mimeType : String;
        content  : LargeBinary;
    };
    function resetAllData() returns String;
    function Approvals(suppliername : String)                          returns array of {
    level : String;
    email  : String;
    name: String;
    status : String;
    comment: String;
    updatedAt: Timestamp;
  };
}

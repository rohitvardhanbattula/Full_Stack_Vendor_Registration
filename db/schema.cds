namespace my.supplier;

using { cuid } from '@sap/cds/common';

entity Supplier : cuid {
    key supplierName      : String(200) @cds.persistence.unique;
        mainAddress       : Association to Address;
        primaryContact    : Association to Contact;
        categoryAndRegion : Association to CategoryRegion;
        additionalInfo    : Association to AdditionalInfo;
        attachments       : Association to many Attachment
                                on attachments.supplier = $self;
}

entity Address : cuid {
    street     : String(200);
    line2      : String(200);
    line3      : String(200);
    city       : String(100);
    postalCode : String(20);
    country    : String(100);
    region     : String(100);
}

entity Contact : cuid {
    firstName : String(100);
    lastName  : String(100);
    email     : String(200);
    phone     : String(50);
}

entity CategoryRegion : cuid {
    category : String(100);
    region   : String(100);
}

entity AdditionalInfo : cuid {
    details : String(100);
}

entity Attachment : cuid {
    supplier     : Association to Supplier;
    supplierName : String;
    key fileName : String(255);
    mimeType     : String(100);
    content      : LargeString;
    uploadedAt   : Timestamp;
}

entity Approver : cuid {
    name        : String(100);
    email       : String(200);
    country        : String(50);
    level: Integer;
}

entity ApproverComment : cuid {
    approver   : Association to Approver;
    supplier   : Association to Supplier on supplier.supplierName=sup_name;
    sup_name : String(100);
    level: String;
    name        : String(100);
    email       : String(200);
    status      : String(30);
    comment    : String(1000);
    createdAt  : Timestamp;
}

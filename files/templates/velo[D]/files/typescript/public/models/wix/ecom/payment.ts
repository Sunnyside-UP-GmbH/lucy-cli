import { z } from 'zod';

const addressSchema = z.object({
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
    streetAddress: z.object({
        name: z.string().optional(),
        number: z.string().optional(),
    }).optional(),
    subdivision: z.string().optional(),
});

const fullAddressContactDetailsSchema = z.object({
    company: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    vatId: z.object({
        _id: z.string().optional(),
        type: z.enum(['CNPJ', 'CPF', 'UNSPECIFIED']).optional(),
    }).optional(),
});

const itemTaxFullDetailsSchema = z.object({
    taxRate: z.string().optional(),
    taxableAmount: z.object({
    amount: z.string(),
    }).optional(),
    totalTax: z.object({
        amount: z.string(),
    }).optional(),
});

const priceSchema = z.object({
    amount: z.string(),
    formattedAmount: z.string().optional(),
});

const lineItemSchema = z.object({
    productName: z.object({
        original: z.string(),
        translated: z.string().optional(),
    }),
    catalogReference: z.object({
        catalogItemId: z.string(),
        appId: z.string(),
        options: z.object({
            options: z.record(z.unknown()),
            variantId: z.string().optional(),
        }).optional(),
    }),
    quantity: z.number(),
    totalDiscount: priceSchema.optional(),
    descriptionLines: z.array(z.string()).optional(),
    image: z.string().optional(),
    physicalProperties: z.object({
        sku: z.string(),
        shippable: z.boolean(),
    }).optional(),
    itemType: z.object({
        preset: z.string(),
    }).optional(),
    price: priceSchema,
    priceBeforeDiscounts: priceSchema.optional(),
    totalPriceBeforeTax: priceSchema.optional(),
    totalPriceAfterTax: priceSchema.optional(),
    paymentOption: z.string().optional(),
    taxDetails: itemTaxFullDetailsSchema.optional(),
    taxInfo: z.object({
        taxAmount: priceSchema.optional(),
        taxableAmount: priceSchema.optional(),
        taxRate: z.string(),
        taxIncludedInPrice: z.boolean().optional(),
        taxBreakdown: z.array(z.unknown()).optional(),
    }).optional(),
    digitalFile: z.object({
        fileId: z.string(),
        expirationDate: z.union([z.string(), z.date()]), // Accepts either a string or a date
    }).optional(),
    locations: z.array(z.unknown()).optional(),
    lineItemPrice: priceSchema.optional(),
    customLineItem: z.boolean().optional(),
    rootCatalogItemId: z.string().optional(),
    taxableAddress: z.object({
        addressType: z.string(),
    }).optional(),
    _id: z.string(),
});

const appliedDiscountSchema = z.object({
    _id: z.string(),
    discountType: z.enum(['GLOBAL', 'SHIPPING', 'SPECIFIC_ITEMS']),
    lineItemIds: z.array(z.string()).optional(),
    coupon: z.object({
        _id: z.string().optional(),
        amount: priceSchema.optional(),
        code: z.string().optional(),
        name: z.string().optional(),
    }).optional(),
    discountRule: z.object({
        _id: z.string().optional(),
        amount: priceSchema.optional(),
        name: z.object({
            original: z.string(),
            translated: z.string(),
        }),
    }).optional(),
    merchantDiscount: z.object({
        amount: priceSchema,
        description: z.string().optional(),
        discountReason: z.enum(['EXCHANGED_ITEMS', 'UNSPECIFIED']).optional(),
    }).optional(),
});

const additionalFeeSchema = z.object({
    _id: z.string(),
    code: z.string(),
    lineItemIds: z.array(z.string()).optional(),
    name: z.string(),
    price: priceSchema,
    priceAfterTax: priceSchema.optional(),
    priceBeforeTax: priceSchema.optional(),
    providerAppId: z.string().optional(),
    taxDetails: itemTaxFullDetailsSchema.optional(),
});

const eventMetadataSchema = z.object({
    id: z.string(),
    entityId: z.string(),
    eventTime: z.string(),
    triggeredByAnonymizeRequest: z.boolean().optional(),
});

const orderSchema = z.object({
    number: z.string(),
    lineItems: z.array(lineItemSchema),
    buyerInfo: z.object({
        contactId: z.string(),
        email: z.string(),
        memberId: z.string().optional(),
        visitorId: z.string().optional(),
        buyerLanguage: z.string().optional(), // Made optional to avoid the error
        buyerNote: z.string().optional(),
    }),
    paymentStatus: z.enum(['FULLY_REFUNDED', 'NOT_PAID', 'PAID', 'PARTIALLY_PAID', 'PARTIALLY_REFUNDED', 'PENDING', 'UNSPECIFIED']),
    fulfillmentStatus: z.string().optional(),
    currency: z.string(),
    taxIncludedInPrices: z.boolean(),
    siteLanguage: z.string().optional(),
    priceSummary: z.object({
        subtotal: priceSchema,
        shipping: priceSchema.optional(),
        tax: priceSchema.optional(),
        discount: priceSchema.optional(),
        totalPrice: priceSchema,
        total: priceSchema,
        totalWithGiftCard: priceSchema.optional(),
        totalWithoutGiftCard: priceSchema.optional(),
        totalAdditionalFees: priceSchema.optional(),
    }),
    billingInfo: z.object({
        address: addressSchema.optional(),
        contactDetails: fullAddressContactDetailsSchema,
    }).optional(),
    status: z.enum(['APPROVED', 'CANCELED', 'INITIALIZED']),
    archived: z.boolean(),
    taxSummary: z.object({
        totalTax: priceSchema.optional(),
        manualTaxRate: z.string().optional(),
    }).optional(),
    taxInfo: z.object({
        totalTax: priceSchema.optional(),
        taxBreakdown: z.array(z.unknown()).optional(),
        manualTaxRate: z.string().optional(),
    }).optional(),
    appliedDiscounts: z.array(appliedDiscountSchema).optional(),
    activities: z.array(
        z.object({
            type: z.string(),
            _id: z.string(),
            _createdDate: z.union([z.string(), z.date()]), // Accepts either a string or a date
        })
    ),
    attributionSource: z.enum(['FACEBOOK_ADS', 'UNSPECIFIED']).optional(),
    createdBy: z.record(z.unknown()).optional(),
    channelInfo: z.object({
        type: z.enum([
            'AMAZON', 'BACKOFFICE_MERCHANT', 'CLASS_PASS', 'EBAY', 'ETSY',
            'FACEBOOK', 'FAIRE_COM', 'GLOBAL_E', 'OTHER_PLATFORM', 'POS',
            'TIKTOK', 'UNSPECIFIED', 'WEB', 'WISH', 'WIX_APP_STORE', 'WIX_INVOICES'
        ]),
    }).optional(),
    seenByAHuman: z.boolean().optional(),
    checkoutId: z.string().optional(),
    customFields: z.array(z.unknown()).optional(),
    cartId: z.string().optional(),
    isInternalOrderCreate: z.boolean().optional(),
    payNow: z.object({
        subtotal: priceSchema,
        shipping: priceSchema.optional(),
        tax: priceSchema.optional(),
        discount: priceSchema.optional(),
        totalPrice: priceSchema,
        total: priceSchema,
        totalWithGiftCard: priceSchema.optional(),
        totalWithoutGiftCard: priceSchema.optional(),
        totalAdditionalFees: priceSchema.optional(),
    }).optional(),
    balanceSummary: z.object({
        balance: priceSchema,
        paid: priceSchema,
        refunded: priceSchema.optional(),
        authorized: priceSchema.optional(),
        pendingRefund: priceSchema.optional(),
    }).optional(),
    additionalFees: z.array(additionalFeeSchema).optional(),
    purchaseFlowId: z.string().optional(),
    recipientInfo: z.object({
        address: addressSchema.optional(), // Made optional to avoid the error
        contactDetails: fullAddressContactDetailsSchema,
    }).optional(),
});

export const orderPaymentStatusUpdatedSchema = z.object({
    metadata: eventMetadataSchema,
    data: z.object({
        order: orderSchema,
        previousPaymentStatus: z.enum(['FULLY_REFUNDED', 'NOT_PAID', 'PAID', 'PARTIALLY_PAID', 'PARTIALLY_REFUNDED', 'PENDING', 'UNSPECIFIED']).optional(),
    }),
});

export type OrderPaymentStatusUpdated = z.infer<typeof orderPaymentStatusUpdatedSchema>;
export type OrderSchema = z.infer<typeof orderSchema>;
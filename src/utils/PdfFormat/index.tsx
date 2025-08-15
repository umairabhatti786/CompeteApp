export const generatePdfContent = (orderDetails: any) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Information</title>
    <style>
        /* Reset styles for email */
        body, html {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
        }
        table {
            width: 100%;
            max-width: 800px;
            margin: 20px auto;
            background-color: #fff;
            border-collapse: collapse;
        }
        th, td {
            padding: 15px;
            text-align: left;
        }
        th {
            background-color: white;
        }
        .container {
            padding: 1x 20px 1px 20px;
        }
        .logo {
            display: block;
            margin: 0 auto;
            background-color: white;
        }
        .order-details {
            margin-bottom: 20px;
        }
        .order-details td {
            border-bottom: 1px solid #ddd;
            padding: 20px;
        }
        .delivery-address {
            margin-bottom: 1px;
        }
        .message {
            line-height: 1.5;
        }
        .products-summary {
            margin-bottom: 20px;
        }
        .order-items {
            border-top: 1px solid #ddd;
        }
        .order-item {
            padding: 10px 0;
            font-weight: bold;
        }
        .summary-table {
            width: 100%;
            padding: 20px 0;
        }
        .footer {
            text-align: center;
            padding: 20px 0;
        }
        .order-summary-header {
            color: darkcyan;
        }
    </style>
</head>
<body>
<table>
   
        <td colspan="2" class="container">
            <h2 style="color: #2DC653">Order Information</h2>
            <div style="border-bottom: 1px solid #ddd; margin: 0; padding: 0;">
            <div style="display: flex; vertical-align: top;">
                <div style="flex: 1; "> <!-- Adjust padding as needed -->
                    <strong style="color: #2DC653"><u>Summary</u></strong><br>
                    <p >
                        <strong style="line-height: 1.5;" >Order Number:</strong> ${
                          orderDetails.id
                        }<br>
                        <strong>Order Time:</strong> ${orderDetails.created_at}
                    </p>
                </div>
                <div style="flex: 1; border-left: 2px solid #ddd; padding: 10px"> <!-- Adjust padding as needed -->
                    <strong style="color: #2DC653"><u>Delivery Address:</u></strong><br>
                    <p>${orderDetails.data?.delivery?.user_address ?? "N/A"}</p>
                </div>
            </div>
        </div>
        
            <div style="padding:0px">
                <p style="color: #2DC653;margin-bottom:15px"><strong>Dear ${
                  orderDetails.customer?.name ?? ""
                },</strong></p>

                ${
                    orderDetails?.status == "0"
                      ? ` <div
                    <p>Thank you for shopping with us! We’ve received your order <strong style="color: #2DC653">#${orderDetails?.id}</strong> and it is currently being reviewed.</p> 
                    </div>
                    `
                      : ""
                  }
         
                ${
                  orderDetails?.status == "1"
                    ? ` <div
                  <p>We’re pleased to inform you that your order <strong style="color: #2DC653">#${orderDetails?.id}</strong> has been accepted and is now being prepared for dispatch.</p> 
                  </div>
                  `
                    : ""
                }
                ${
                  orderDetails?.status == "2"
                    ? `
                  <div
                  <p>We’ve started processing your order <strong style="color: #2DC653">#${orderDetails?.id}</strong> Our team is working to prepare your items for shipment.</p>
                  </div>
                  `
                    : ""
                }
                ${
                  orderDetails?.status == "3"
                    ? `
                  <div
                  <p>Good news! Your order <strong style="color: #2DC653">#${orderDetails?.id}</strong> has been shipped and is on its way.</p>
                  </div>
                  `
                    : ""
                }
                ${
                  orderDetails?.status == "4"
                    ? `
                  <div
                  <p>We are pleased to inform you that your order <strong style="color: #2DC653">#${orderDetails?.id}</strong> has been successfully delivered. We hope everything arrived in perfect condition.</p>
                  </div>
                  `
                    : ""
                }
                ${
                  orderDetails?.status == "5"
                    ? `
                  <div
                  <p>We regret to inform you that your order <strong style="color: #2DC653">#${orderDetails?.id}</strong> has been cancelled.</p>
                  </div>
                  `
                    : ""
                }
                     ${
                       orderDetails?.status == "3"
                         ? ` <div style="padding:0px ;line-height: 1;">
                     <p style="margin-bottom:5px"><strong style="color: #000000">Expected Delivery Date: </strong> ${orderDetails.is_preorder_data?.date}</p>
     
                     </div>`
                         : ""
                     }

                     ${
                       orderDetails?.status == "4"
                         ? ` <div style="padding:0px ;line-height: 1;">
                      <p style="margin-bottom:5px">Thank you for your trust.</p>
                      <p style="margin-bottom:5px">Warm regards,</p>
      
                      </div>`
                         : ""
                     }
            </div
            <div class="products-summary" style="overflow-x:auto;">
                <table class="s">
                    <thead>
                    <div style="display: flex; border-radius: 10px; border: 3px solid #2DC653; overflow: hidden; margin-bottom: -20px; margin-top: 20px;">
                    <div style="flex: 1; background-color: #ffff !important; color: black; border-right: 3px solid #2DC653; padding: 10px;  margin-right:20px">
                        <p style="margin: 0;">Qty | Item</p>
                    </div>
                    <div style="flex: 1; background-color: #ffff  !important; color: black; padding: 10px;">
                        <p style="margin: 0; text-align: right;">Price</p>
                    </div>
                </div>
                   
                    </thead>
                    <tbody>
                    ${orderDetails.products
                      .map(
                        (item: any) => `
                        <tr class="order-item">
                            <td>
                                ${item.quantity} X ${item.name} - £${item.price}<br>
                               
                            </td>
                            <td style="text-align: right; vertical-align: top">£${item.sub_total}</td>
                        </tr>
                    `
                      )
                      .join("")}
                    </tbody>
                </table>
            </div>

            <div class="summary-table" style="overflow-x:auto;            border-top: 1px solid #ddd;
            ">
    <div style="display: flex; justify-content: space-between; padding: 8px 0;">
        <div style="font-weight: bold;">Subtotal:</div>
        <div class="text-right">£${orderDetails.values?.subtotal ?? ""}</div>
    </div>

    
    ${
      orderDetails.values?.discount > 0
        ? `
    <div style="display: flex; justify-content: space-between; padding: 8px 0;">
        <div style="font-weight: bold;">Discount:</div>
        <div class="text-right">£${orderDetails.values.discount}</div>
    </div>
    `
        : ""
    }
    ${
      orderDetails.values?.tax > 0
        ? `
    <div style="display: flex; justify-content: space-between; padding: 8px 0;">
        <div style="font-weight: bold;">Vat:</div>
        <div class="text-right">£${orderDetails.values.tax}</div>
    </div>
    `
        : ""
    }

    <div style="display: flex; justify-content: space-between; padding: 8px 0;">
    <div style="font-weight: bold;">Total:</div>
    <div class="text-right">£${orderDetails.total ?? ""}</div>
</div>
   
   

           
        </td>
    </tr>
    <tr>
        <td colspan="2" class="footer">
            <p>Thank you for choosing our services</p>
            <p>&copy; ${new Date().getFullYear()} <strong style="color: #2DC653">London Prime Produce.</strong> All rights reserved.</p>
        </td>
    </tr>
</table>
</body>
</html>
`;

export function emailTemplate(otp: string) {
    return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>

  <body style="
    margin:0;
    padding:0;
    background:#000000;
    font-family:Arial, Helvetica, sans-serif;
  ">

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 20px;">

          <div style="
            max-width:420px;
            background:#0a0a0a;
            border:1px solid #333;
            border-radius:16px;
            padding:40px;
            text-align:center;
            color:white;
          ">

            <h1 style="
              color:#ffffff;
              font-size:32px;
              margin-bottom:10px;
            ">
              RouterOne
            </h1>

            <p style="
              color:#999999;
              font-size:14px;
              margin-bottom:35px;
            ">
              Verify your account securely
            </p>


            <h2 style="
              color:white;
              font-size:20px;
            ">
              Your OTP Code
            </h2>


            <div style="
              background:#000000;
              border:1px solid #444;
              border-radius:12px;
              padding:20px;
              margin:25px 0;
              color:#ffffff;
              font-size:36px;
              font-weight:bold;
              letter-spacing:10px;
            ">
              ${otp}
            </div>


            <p style="
              color:#bbbbbb;
              font-size:14px;
              line-height:22px;
            ">
              This OTP expires in 
              <strong style="color:white;">
                10 minutes
              </strong>.
            </p>


            <hr style="
              border:none;
              border-top:1px solid #333;
              margin:30px 0;
            "/>


            <p style="
              color:#666;
              font-size:12px;
            ">
              If you didn't request this verification code,
              ignore this email.
            </p>

          </div>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `
}

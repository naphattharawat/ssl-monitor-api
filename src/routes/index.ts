import * as express from 'express';
import { Router, Request, Response } from 'express';
import { Jwt } from '../models/jwt';
import { RequestModel } from '../models/request';

import * as HttpStatus from 'http-status-codes';
var sslChecker = require('ssl-checker');
const jwt = new Jwt();
const requestModel = new RequestModel();
const router: Router = Router();
const extractDomain = require("extract-domain");

router.get('/', async (req: Request, res: Response) => {
  try {
    const rs: any = await requestModel.getData(req.db);
    res.send({ ok: true, rows: rs });
  } catch (error) {
    console.log(error);
    res.send({ ok: false })
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const url = req.body.url;
    let domain = await cutdomain(url);
    console.log(domain);

    let getSslDetails;
    let isError = false;
    try {
      getSslDetails = await sslChecker(domain, { method: "GET", port: 443, rejectUnauthorized: true });
      // console.log(getSslDetails);
    } catch (error) {
      isError = true;
    }
    // console.log(isError);
    
    if (!isError) {
      const obj = {
        days: getSslDetails.daysRemaining,
        valid: getSslDetails.valid,
        valid_from: getSslDetails.validFrom,
        valid_to: getSslDetails.validTo,
        valid_for: getSslDetails.validFor.join(",")
      }
      // await requestModel.saveRequest(req.db, {
      //   domain: domain,
      //   valid: getSslDetails.valid ? 'Y' : 'N',
      //   valid_from: getSslDetails.validFrom,
      //   valid_to: getSslDetails.validTo,
      //   valid_for: getSslDetails.validFor.join(",")
      // })
      res.send({ ok: true, data: obj })
    } else {
      res.send({ ok: false })
    }

    // res.send(getSslDetails)

  } catch (error) {
    console.log(error);
    res.send({ ok: false })
  }

});

router.put('/', async (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    const url = req.body.url;
    console.log(id, url);

    let domain = await cutdomain(url);
    let getSslDetails;
    let isError = false;
    try {
      getSslDetails = await sslChecker(domain, { method: "GET", port: 443 });
    } catch (error) {
      isError = true;
    }
    if (!isError) {
      const obj = {
        days: getSslDetails.daysRemaining,
        valid: getSslDetails.valid,
        valid_from: getSslDetails.validFrom,
        valid_to: getSslDetails.validTo,
        valid_for: getSslDetails.validFor.join(",")
      }
      await requestModel.update(req.db, id, {
        valid: getSslDetails.valid ? 'Y' : 'N',
        valid_from: getSslDetails.validFrom,
        valid_to: getSslDetails.validTo,
        valid_for: getSslDetails.validFor.join(",")
      })
      res.send({ ok: true, data: obj })
    } else {
      res.send({ ok: false })
    }
    console.timeEnd('ssl')
    res.send(getSslDetails)

  } catch (error) {
    console.log(error);
    res.send({ ok: false })
  }

});

function cutdomain(url) {
  if (url.substring(0, 7) == 'http://') {
    return url.substring(7, url.length)
  } else if (url.substring(0, 8) == 'https://') {
    return url.substring(8, url.length)
  } else {
    return url
  }
}
export default router;
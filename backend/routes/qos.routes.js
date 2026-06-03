import express from 'express';
import QoSService from '../services/qos.service.js';
import SSHService from '../services/ssh.service.js';

export default function qosRoutes(io) {
  const router = express.Router();

  let sshService;
  let qosService;

  const ensureConnection = async (req, res, next) => {
    try {
      if (!sshService || !qosService) {
        sshService = new SSHService(global.config);
        qosService = new QoSService(sshService);
        await sshService.connect();
      }
      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'خطأ في الاتصال بـ OpenWrt',
        error: error.message
      });
    }
  };

  // الحصول على إعدادات QoS
  router.get('/config', ensureConnection, async (req, res) => {
    try {
      const config = await qosService.getConfig();
      res.json({
        success: true,
        data: config
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'فشل في الحصول على الإعدادات',
        error: error.message
      });
    }
  });

  // إضافة قاعدة QoS
  router.post('/rules', ensureConnection, async (req, res) => {
    try {
      const { name, port, protocol, priority, bandwidth } = req.body;
      
      if (!name || !port || !protocol) {
        return res.status(400).json({
          success: false,
          message: 'معاملات مفقودة'
        });
      }

      const result = await qosService.addRule(name, port, protocol, priority, bandwidth);
      
      io.emit('qos:rule-added', {
        rule: name,
        port: port,
        timestamp: new Date().toISOString()
      });

      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'فشل في إضافة القاعدة',
        error: error.message
      });
    }
  });

  // الحصول على استخدام النطاق الترددي
  router.get('/bandwidth-usage', ensureConnection, async (req, res) => {
    try {
      const usage = await qosService.getBandwidthUsage();
      res.json({
        success: true,
        data: usage
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'فشل في الحصول على استخدام النطاق',
        error: error.message
      });
    }
  });

  return router;
}

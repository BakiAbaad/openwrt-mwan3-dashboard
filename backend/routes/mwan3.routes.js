import express from 'express';
import MWAN3Service from '../services/mwan3.service.js';
import SSHService from '../services/ssh.service.js';

export default function mwan3Routes(io) {
  const router = express.Router();

  let sshService;
  let mwan3Service;

  // Middleware للتحقق من الاتصال
  const ensureConnection = async (req, res, next) => {
    try {
      if (!sshService || !mwan3Service) {
        sshService = new SSHService(global.config);
        mwan3Service = new MWAN3Service(sshService);
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

  // الحصول على إعدادات MWAN3
  router.get('/config', ensureConnection, async (req, res) => {
    try {
      const config = await mwan3Service.getConfig();
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

  // الحصول على الواجهات
  router.get('/interfaces', ensureConnection, async (req, res) => {
    try {
      const interfaces = await mwan3Service.getInterfaces();
      res.json({
        success: true,
        data: interfaces
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'فشل في الحصول على الواجهات',
        error: error.message
      });
    }
  });

  // إضافة واجهة جديدة
  router.post('/interfaces', ensureConnection, async (req, res) => {
    try {
      const { name, proto, ifname, type } = req.body;
      
      if (!name || !proto || !ifname) {
        return res.status(400).json({
          success: false,
          message: 'معاملات مفقودة'
        });
      }

      const result = await mwan3Service.addInterface(name, proto, ifname, type || 'wan');
      
      io.emit('mwan3:interface-added', {
        interface: name,
        timestamp: new Date().toISOString()
      });

      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'فشل في إضافة الواجهة',
        error: error.message
      });
    }
  });

  // تحديث واجهة
  router.put('/interfaces/:name', ensureConnection, async (req, res) => {
    try {
      const { name } = req.params;
      const updates = req.body;

      const result = await mwan3Service.updateInterface(name, updates);
      
      io.emit('mwan3:interface-updated', {
        interface: name,
        updates: updates,
        timestamp: new Date().toISOString()
      });

      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'فشل في تحديث الواجهة',
        error: error.message
      });
    }
  });

  // حذف واجهة
  router.delete('/interfaces/:name', ensureConnection, async (req, res) => {
    try {
      const { name } = req.params;
      const result = await mwan3Service.deleteInterface(name);
      
      io.emit('mwan3:interface-deleted', {
        interface: name,
        timestamp: new Date().toISOString()
      });

      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'فشل في حذف الواجهة',
        error: error.message
      });
    }
  });

  // إضافة عضو (Member)
  router.post('/members', ensureConnection, async (req, res) => {
    try {
      const { name, interface_name, metric } = req.body;
      const result = await mwan3Service.addMember(name, interface_name, metric || 1);
      
      io.emit('mwan3:member-added', {
        member: name,
        interface: interface_name,
        timestamp: new Date().toISOString()
      });

      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'فشل في إضافة العضو',
        error: error.message
      });
    }
  });

  // إضافة سياسة
  router.post('/policies', ensureConnection, async (req, res) => {
    try {
      const { name, members } = req.body;
      const result = await mwan3Service.addPolicy(name, members);
      
      io.emit('mwan3:policy-added', {
        policy: name,
        members: members,
        timestamp: new Date().toISOString()
      });

      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'فشل في إضافة السياسة',
        error: error.message
      });
    }
  });

  // إضافة قاعدة
  router.post('/rules', ensureConnection, async (req, res) => {
    try {
      const { name, policy, protocol } = req.body;
      const result = await mwan3Service.addRule(name, policy, protocol || 'all');
      
      io.emit('mwan3:rule-added', {
        rule: name,
        policy: policy,
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

  // الحصول على الحالة
  router.get('/status', ensureConnection, async (req, res) => {
    try {
      const status = await mwan3Service.getStatus();
      res.json({
        success: true,
        data: status
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'فشل في الحصول على الحالة',
        error: error.message
      });
    }
  });

  // إعادة تشغيل MWAN3
  router.post('/restart', ensureConnection, async (req, res) => {
    try {
      const result = await mwan3Service.restart();
      
      io.emit('mwan3:restarted', {
        timestamp: new Date().toISOString()
      });

      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'فشل في إعادة التشغيل',
        error: error.message
      });
    }
  });

  // إيقاف MWAN3
  router.post('/stop', ensureConnection, async (req, res) => {
    try {
      const result = await mwan3Service.stop();
      
      io.emit('mwan3:stopped', {
        timestamp: new Date().toISOString()
      });

      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'فشل في الإيقاف',
        error: error.message
      });
    }
  });

  // تشغيل MWAN3
  router.post('/start', ensureConnection, async (req, res) => {
    try {
      const result = await mwan3Service.start();
      
      io.emit('mwan3:started', {
        timestamp: new Date().toISOString()
      });

      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'فشل في التشغيل',
        error: error.message
      });
    }
  });

  return router;
}

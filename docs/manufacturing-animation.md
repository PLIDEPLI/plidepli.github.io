# 制造流程动画与天线素材校正

## 团队校正

团队确认：旧天线短片 5–21 秒是射频板调试，不应作为天线调试。原“制作过程”文件夹内 `微信视频2026-09-13_094737_747.mp4` 中的贴铜皮操作属于天线调试。

新版天线短片为：5 秒天线照片、原片 1–13 秒的贴铜皮操作、4 秒壳内天线照片、4 秒匹配仪器照片、5 秒天线研发照片，共 30 秒。旧版 5–21 秒使用的两条 RF 板调试视频均已移除。图集第 6 张换为贴铜皮原片 8 秒处截帧；旋转纠正拍摄方向，保留实际内容。制造图集原先误标为屏蔽装配的铜皮截帧移除，改为真实的已装配电路板照片。

## 第 7 章动画

原创等距工艺动画，1280 × 720、30 fps、30 秒，保留制作章节的独立原创配乐。六阶段各 5 秒：

1. 下壳体压铸：合模、注入金属、冷却和脱模。
2. 上壳体注塑：塑料颗粒、模具注射和成形的上盖。
3. PCB 加工：层叠、钻孔与镀铜概念、线路形成、阻焊与表面处理。
4. 组装：电路板与元件、天线、外壳及紧固件组合。
5. 测试：仪器连接及示意 RF 曲线；没有数值、通过标记或性能承诺。
6. 包装：主机、室外天线、线缆和电源进入包装盒。

团队提供工艺顺序。动画描绘计划中的制造流程，网站和片内持续标注动画/计划流程，区别于真实车间照片。几何图形是原创建模示意，不是产品 CAD、工厂仿真或量产证据。实际设备、模具、制造参数、流程细节以最终工程方案为准。

原始实拍和历史素材保留。动画由 `scripts/build-process-animation.py` 绘制并编码，完整素材重建由 `scripts/build-story-media.py` 分派。命令：

```sh
python3 scripts/build-story-media.py --only antenna manufacturing
```

## 公开参考资料

仅参考工艺原理，未下载、剪用第三方视频、图片、商标或配乐。动画所有图形由代码原创绘制。

- [NADCA：Die casting FAQ](https://www.diecasting.org/faq/)：高压向可复用钢模注入液态金属，冷却成形。
- [Protolabs：Plastic injection moulding](https://www.protolabs.com/en-gb/services/injection-moulding/plastic-injection-moulding-services/)：塑料颗粒熔化后注入模腔并固化。
- [Eurocircuits：PCB manufacturing technology](https://www.eurocircuits.com/technical-guidelines/pcb-manufacturing-technology/)：PCB 成形、线路、阻焊和表面处理资料。

以上资料用于一般工艺校核，不代表这些机构参与 PLIDEPLI 制造或对产品背书。

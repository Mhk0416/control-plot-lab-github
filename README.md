# dsh-control-plot-lab

根据连续时间传递函数 `G(s)` 绘制 **Bode 图、Nyquist 图、根轨迹**，并在右侧给出逐步计算过程的 DeepSeek Harness 插件。

> GitHub-only 发布，不需要 npm。安装源就是本仓库。

## 安装

需要 DeepSeek Harness `>=0.2.1`。

```powershell
# Web profile
dsh plugin --profile web add github:Mhk0416/control-plot-lab-github

# DSH Desktop 的 profile 通常叫 desktop
dsh plugin --profile desktop add github:Mhk0416/control-plot-lab-github
```

安装后刷新一次页面。也可以从插件市场的 GitHub 条目一键安装。

> 安装时需要访问 GitHub；安装完成后插件本身完全本地运行，断网也能画图和算步骤。

### 从本地开发版迁移

如果你之前装过本地开发版 `@local/control-plot-lab`，请先在插件管理里移除或停用它，再安装 GitHub 版。两者使用同一个 bundle 行 id，不能同时启用。

## 打开方式

安装后有两个入口：

1. **聊天输入框左侧工具栏**的曲线小图标（“控制绘图”）；
2. **页面右下角偏上的蓝色浮动按钮“控制绘图”**。按住按钮可以拖到任意位置，松手后位置会记住，避免被其它悬浮组件挡住。

点击任意一个打开全屏面板；按 `Esc` 或点击遮罩关闭。

## 输入格式

变量固定为 `s`，参数使用 `K`，支持：

```text
10/(s*(s+1)*(s+2))
(s+2)/(s^2+2*s+5)
s/(s+1)^3
3/[(K*s+3)*(s+1)]
e^(-0.5s)/(s+1)
exp(-0.3*s)/(s^2+2*s+2)
```

- 乘号可以省略：`2s`、`s(s+1)`、`3(s+2)`。
- 支持 `+ - * / ^`、圆括号、方括号分组。
- 纯滞后写成 `e^(-τs)` 或 `exp(-τs)`，只能作为**乘性因子**；不支持 `e^(-s) + ...`。
- `K` 只能以一次方出现；不支持 `K^2`。
- 当前版本最高 12 阶（不含滞后 Padé 近似增加的 2 阶）。

## 三张图与步骤

### Bode

- 幅频（dB）与相频（°）共用对数频率轴；
- 标出转折频率、剪切频率 `ωc`、相位穿越频率 `ωg`、PM、GM；
- 可开关渐近线与网格；
- 含纯滞后时使用精确的 `e^(-jωτ)`；
- 步骤包括：化为多项式、代入 `s=jω`、极点/零点、型别与低频斜率、转折频率、PM/GM、延迟裕度、闭环稳定性。

### Nyquist

- 绘制 `ω: 0→∞` 的主曲线及镜像；
- 标出 `−1` 点、起点/终点、实轴交点；
- 原点或虚轴上的极点用右半平面小半圆绕行，并绘制无穷远圆弧；
- 计算 `P`、顺时针包围数 `N`、`Z=P+N`；
- 含纯滞后时仍精确绘制螺旋，但包围数不再有限，稳定性改用延迟裕度与二阶 Padé 近似判断；
- 分子分母同阶时，无穷远圆弧映射到首项系数比，而不是原点。

### 根轨迹

- 标准形式：`1 + K·G(s)=0`；
- 若传递函数中出现符号 `K`，自动按 `1 + G(s;K)=0` 整理成 `A(s)+K·B(s)=0`，支持 `K` 在分子或分母；
- 标出极点 `×`、零点 `○`、分支箭头、渐近线、分离/会合点、虚轴交点；
- 给出实轴段、渐近线质心/角度、出射角、稳定 K 范围；
- 含纯滞后时用**二阶 Padé** 近似并在图中明确标注；Bode/Nyquist 仍使用精确滞后。

### 图表缩放

每张图右上角有 `缩放 + − ⟲`：

- 点 `+` / `−` 放大缩小，或直接滚轮缩放；
- 放大后按住图拖动可平移；
- `⟲` 复位。

## 目录结构

```text
.
  package.json          bundle 清单（dsh.bundle / dsh.client）
  cordis.patch.yml      插入 control-plot-lab 行
  index.js              Host 空壳
  client.js             预构建的单文件 Client module（提交进仓库）
  src/engine.js         解析器、多项式/复数、Bode/Nyquist/根轨迹
  src/ui.js             React 面板与 SVG 绘图
  build.mjs             把 engine + ui 打包进 client.js
  test/engine.test.cjs  数值回归测试
  locale/{zh,en}.json   插件标题/描述
  icon.svg              插件图标
  market/               插件市场收录 PR 用的 YAML 与 PR 正文
```

## 开发与验证

```powershell
node test/engine.test.cjs
node build.mjs
node --check client.js
```

`client.js` 必须提交进仓库；GitHub 安装不会自动运行构建脚本。

测试覆盖：多项式展开、纯滞后相位、Bode 手算值、PM/GM、Nyquist 包围数（含 RHP 极点、同阶系统）、标准/参数 K 根轨迹、分离点、虚轴交点、稳定 K 范围、Padé 路径、圆形根轨迹分段。

## 已知限制

- 只支持连续时间、集中参数、有理传递函数；不支持离散系统、状态空间输入。
- 纯滞后只支持乘性因子，且根轨迹使用二阶 Padé 近似。
- 含纯滞后时 Nyquist 的包围数不是有限整数，界面会明确改为延迟裕度/Padé 稳定性判断。
- 阶数上限 12；更高阶会提示降阶。

## License

MIT

# 发布到 GitHub 与 DSH 插件市场

本仓库是 **GitHub-only** 发布：不需要 npm，也不需要构建服务器。`client.js` 已预构建并提交。

仓库地址：<https://github.com/Mhk0416/control-plot-lab-github>

## 1. 推送到 GitHub

在 `control-plot-lab-github` 目录执行：

```powershell
git init -b main
git add -A
git commit -m "dsh-control-plot-lab 1.0.0"
git remote add origin https://github.com/Mhk0416/control-plot-lab-github.git
git push -u origin main
git tag v1.0.0
git push origin v1.0.0
```

没有 `gh` 的话，也可以直接在 GitHub 网页创建空仓库，再执行上面的 `git remote add` 和 `git push`。

推送前确认：

- 仓库是 **public**
- 有 `dsh-plugin` topic
- 根目录有 `package.json`、`cordis.patch.yml`、`client.js`
- `package.json` 里没有 `"private": true`
- `package.json` 里有 `dsh.bundle.patch` 和 `dsh.client`
- 没有 `prepare` / `postinstall` 构建脚本

## 2. 等待仓库满 1 天

市场收录 CI 会检查仓库创建时间，通常要求至少 1 天。刚建好的仓库当天提 PR 会被拒。

## 3. Fork 目录仓库并提 PR

市场目录在：

<https://github.com/awesome-dsh-plugin/awesome-dsh-plugin>

先 fork：

```powershell
gh repo fork awesome-dsh-plugin/awesome-dsh-plugin --clone=false
gh repo clone Mhk0416/awesome-dsh-plugin
cd awesome-dsh-plugin
git checkout -b add-control-plot-lab
```

把本仓库的 `market/Mhk0416__control-plot-lab-github.yml` 复制到：

```text
awesome-dsh-plugin/data/plugins/Mhk0416__control-plot-lab-github.yml
```

然后：

```powershell
git add data/plugins/Mhk0416__control-plot-lab-github.yml
git commit -m "Add control-plot-lab-github"
git push -u origin add-control-plot-lab
gh pr create --repo awesome-dsh-plugin/awesome-dsh-plugin `
  --head Mhk0416:add-control-plot-lab `
  --title "Add control-plot-lab-github" `
  --body-file ..\control-plot-lab-github\market\PR-body.md
```

注意：

- 一个 PR 最多 3 条
- **不要手工修改生成的 README**，只新增 `data/plugins/*.yml`
- 文件名必须是 `Mhk0416__control-plot-lab-github.yml`
- `name` 必须是 `Mhk0416/control-plot-lab-github`
- 不要手写 `npm:` 字段；GitHub-only 条目由 CI 生成 GitHub 安装源
- 描述里的声明会被评审对照代码核查，不要夸大

没有 `gh` 也可以全程在网页操作：在 GitHub 上 fork `awesome-dsh-plugin/awesome-dsh-plugin`，进入 `data/plugins/`，用 **Add file → Upload files** 上传本仓库的 `market/Mhk0416__control-plot-lab-github.yml`，然后点 **Compare & pull request**。其他字段要求相同。

## 4. 合并后的安装命令

```powershell
# Web profile
dsh plugin --profile web add github:Mhk0416/control-plot-lab-github

# DSH Desktop 的 profile 通常叫 desktop
dsh plugin --profile desktop add github:Mhk0416/control-plot-lab-github
```

市场条目合并后，用户也可以在插件市场里直接点安装。

> 当前这台机器上已经装了本地开发版 `@local/control-plot-lab`。GitHub 版使用同一个 bundle 行 id；测试 GitHub 版之前，请先在插件管理里移除或停用本地版，否则会出现重复行/重复按钮。

## 5. 更新版本

GitHub-only 条目按 GitHub HEAD 检查更新。改完代码后：

```powershell
node build.mjs
node test/engine.test.cjs
git add -A
git commit -m "Release 1.0.1"
git tag v1.0.1
git push
git push origin v1.0.1
```

如果是新增功能，建议同步修改 `package.json` 的 `version`。

## 6. 可选：商店截图

想让市场卡片更好看，可以在仓库里放 1–8 张截图，并在根目录加 `screenshots.json`：

```json
["docs/screenshots/main.png"]
```

路径必须是仓库内的相对路径，不能以 `/` 开头，不能含 `..`。没有截图也能上架。

## 本次发布文件清单

- `package.json`：包名 `dsh-control-plot-lab`，已移除 `private`，补 `license` / `repository` / `engines.dsh`
- `client.js`：已用新包名重新构建（module id = `dsh-control-plot-lab`）
- `cordis.patch.yml`：bundle 行名已改成 `dsh-control-plot-lab`
- `LICENSE`：MIT
- `README.md`：安装、使用、限制、目录结构
- `market/Mhk0416__control-plot-lab-github.yml`：市场收录条目
- `market/PR-body.md`：PR 正文

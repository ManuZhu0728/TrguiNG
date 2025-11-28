> [!IMPORTANT]
> ### Unofficial Fork / 非官方分支声明
>
> **English:**
> This is a modified fork of the original TrguiNG project. The main focus is **Internationalization (i18n) support** (Simplified & Traditional Chinese) and additional feature enhancements.
>
> **中文：**
> 这是 TrguiNG 的一个非官方修改版。核心改动是增加了 **国际化 (i18n) 框架支持**（简体中文 & 繁体中文）以及部分功能增强。
>
> <details>
> <summary><strong>🤖 AI Attribution & Translation Details / AI 模型与翻译说明 (Click to expand)</strong></summary>
>
> **English:**
> * **Framework & Code:** Modified by **GPT-5.1**.
> * **Translation & Replacement:** Handled by **Gemini 3 Pro**.
> * **Quality:**
>     * **Simplified Chinese:** AI-generated + Manually refined referencing [jayzcoder/TrguiNG](https://github.com/jayzcoder/TrguiNG).
>     * **Traditional Chinese:** AI-converted from Simplified Chinese.
>
> **中文：**
> * **框架与代码：** 由 **GPT-5.1** 完成。
> * **翻译与替换：** 由 **Gemini 3 Pro** 完成。
> * **翻译质量：**
>     * **简体中文：** AI 初译 + 参考项目 [jayzcoder/TrguiNG](https://github.com/jayzcoder/TrguiNG) 进行手动润色。
>     * **繁体中文：** 由 AI 参考简体中文自动转换。
> </details>
>
> <details>
> <summary><strong>✨ Additional Features / 额外功能支持 (Click to expand)</strong></summary>
>
> **English:**
> * **Ported from [jayzcoder/TrguiNG](https://github.com/jayzcoder/TrguiNG):**
>     * Group Size Display
>     * Double-click group header to select all
>     * Dedicated Error grouping
>     * Added a new layout mode
>
> **中文：**
> * **移植自 [jayzcoder/TrguiNG](https://github.com/jayzcoder/TrguiNG)：**
>     * 分组体积展示
>     * 双击分组标题全选
>     * 错误状态单独分组
>     * 新增一种布局模式
> </details>
>
> ---
> **Disclaimer:** This repository is intended as a "proof of concept" created via AI rapid prototyping (Vibe Coding). The code quality may differ from official standards.
> **免责声明：** 本仓库代码主要为 AI 辅助快速生成的“概念验证”版本，代码质量可能与官方标准存在差异。


# TrguiNG
**Remote GUI for Transmission torrent daemon**

![GitHub release](https://img.shields.io/github/v/release/ManuZhu0728/TrguiNG)
![Downloads](https://img.shields.io/github/downloads/ManuZhu0728/TrguiNG/total)
![Lint status](https://img.shields.io/github/actions/workflow/status/ManuZhu0728/TrguiNG/lint.yml?label=Lint&event=push)

![logo](https://i.imgur.com/QdgMWwW.png)

`TrguiNG` is a rewrite of [transgui](https://github.com/transmission-remote-gui/transgui)
project using [tauri](https://tauri.app).
Frontend is written in typescript with [react.js](https://react.dev/) and
[mantine](https://mantine.dev/) library. Backend for the app is written in
[rust](https://www.rust-lang.org/).

You can use this program in 2 ways: as a native Windows/Linux/Mac app and as a web gui
served by transmission itself by setting `$TRANSMISSION_WEB_HOME` environment variable
to point to TrguiNG web assets.

There are screenshots of the app available on the
[project wiki](https://github.com/openscopeproject/TrguiNG/wiki).

Some differentiating features:

* Multi tabbed interface for concurrent server connections (native app only)
* Torrent creation with fast multi threaded hashing (native app only)
* Powerful torrent filtering options
* Latest transmission features support: labels, bandwidth groups, sequential download
* Dark and white theme

Planned:

* Better bandwidth groups support when API is ready (https://github.com/transmission/transmission/issues/5455)

Transmission v2.40 or later is required.

## Downloads

You can get the latest release from the
[releases page](https://github.com/ManuZhu0728/TrguiNG/releases).

Weekly builds of current development version are available from github
[build workflows](https://github.com/ManuZhu0728/TrguiNG/actions/workflows/build.yml).
Pick the latest successful run and scroll down to the artifacts section.

## Compiling

Prerequisites:
- [Node.js 16](https://nodejs.org/) or later
- [rust 1.77](https://www.rust-lang.org/) or later
- Geoip lookup database in mmdb format, put it in `src-tauri`
   ```
   wget -nv -O src-tauri/dbip.mmdb "https://github.com/openscopeproject/TrguiNG/releases/latest/download/dbip.mmdb"
   ```
   You can get latest db from [db-ip.com](https://db-ip.com/db/download/ip-to-country-lite).

To compile simply run

```
$ npm install
$ npm run build
```

This will generate optimized bundle in `dist` and a release binary in `src-tauri/target/release` folder.
Also installer package will be available in `src-tauri/target/release/bundle/...`.

The binary is statically linked and embeds all necessary assets except for the geoip database.
It is completely self sufficient and can be used as a portable executable but for geoip lookup to work you
need to install the app with provided installer.

For development run in parallel

```
$ npm run webpack-serve
$ npm run tauri-dev
```

Webpack will automatically watch changes in `src/` and refresh the app view, tauri will watch changes
in `src-tauri/` and rebuild/restart the app as needed.

## How to use TrguiNG as a web interface

Transmission supports custom web interfaces, all you have to do is run the daemon with
`$TRANSMISSION_WEB_HOME` variable pointing to the web assets that transmissinon will serve
over it's `.../transmission/web/` endpoint.

Example steps for debian:
1. Download latest `trguing-web-xxxx.zip` zip from [releases](https://github.com/ManuZhu0728/TrguiNG/releases)
   page.
2. Unpack it anywhere, make sure that the user transmission runs under (by default `debian-transmission`)
   has read permissions.
3. Edit transmission daemon systemd unit file `/etc/systemd/system/multi-user.target.wants/transmission-daemon.service`
   and add following to `[Service]` section:
   ```
   Environment=TRANSMISSION_WEB_HOME=/path/to/extracted/trguing/zip
   ```
4. Reload the unit file with `sudo systemctl daemon-reload`
   and restart the service `sudo systemctl restart transmission-daemon`

## License
Project is distributed under GNU Affero General Public License v3, see `LICENSE.txt` for details.

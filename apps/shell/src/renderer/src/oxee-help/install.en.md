# Installing OxeeOffice

Every release is published on the Releases page, **github.com/Oxeegen/OxeeOffice/releases**.

## Pick the file for your machine

| Platform                             | Requirements                                  | File                                 |
| ------------------------------------ | --------------------------------------------- | ------------------------------------ |
| **Windows**                          | Windows 10 or 11, Intel/AMD (x64)             | `OxeeOffice-<version>-setup.exe`     |
| **Linux** — Debian / Ubuntu          | x86_64, Ubuntu 22.04 or newer                 | `oxeeoffice_<version>_amd64.deb`     |
| **Linux** — Fedora / RHEL / openSUSE | x86_64, Fedora 35+, RHEL 9+, Leap 15.6+       | `oxeeoffice-<version>.x86_64.rpm`    |
| **Linux** — anything else            | x86_64, FUSE 2                                | `OxeeOffice-<version>.AppImage`      |

Older versions stay on the Releases page.

## On Windows

Run the `.exe` installer. It is not signed yet: if SmartScreen stops it, choose **More info ▸ Run anyway**. It puts OxeeOffice in the Start menu and registers `.docx`, `.xlsx`, `.pptx`, `.pdf` and friends so double-clicking a file opens it. Installing over an existing OxeeOffice upgrades it and keeps your settings and history.

## On Linux

**Debian / Ubuntu**

```sh
sudo apt install ./oxeeoffice_<version>_amd64.deb
```

**Fedora / RHEL / openSUSE**

```sh
sudo dnf install ./oxeeoffice-<version>.x86_64.rpm     # Fedora / RHEL family
sudo zypper install ./oxeeoffice-<version>.x86_64.rpm  # openSUSE
```

**AppImage** — runs where it is, with no install step:

```sh
chmod +x OxeeOffice-<version>.AppImage
./OxeeOffice-<version>.AppImage
```

It needs the FUSE 2 runtime. If you would rather not install it, run it with `--appimage-extract-and-run`.

## Updates

The Windows installer and the AppImage update themselves: when a newer release is published, OxeeOffice offers it, and **Help ▸ Check for Updates** checks on demand. A `.deb` or `.rpm` install is updated by installing the newer package.

**Settings ▸ About** shows the version you are running and where the project lives.

![Settings ▸ About, showing the installed version, the update channel and the project's GitHub link](img/install.png)

## The command line comes with it

Every install ships a `genoffice` command that talks to the same engines the window does, so the two never disagree about a file. `genoffice install-cli` puts it on your `PATH`. See **Command line and agents** for what it can do.

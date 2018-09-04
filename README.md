# dulu
Scaffolding tool for my development



# Installation

```shell
npm i -g dulu
```



# Usage

The command line utility has several subcommands.

## Create new project

```shell
dulu create <template> [project]
```

dulu has some predefined templates without download. eg.

```shell
dulu create multicmd-cli demo
```

### From Repo

It also supports download a template from a GitHub repo or others. Use  [shorthand repository string](dulu create multicmd-cli demo) that download-git-repo supports.

```shell
dulu create github:ta7sudan/multicmd-cli demo
```

### Cache

You can cache template by `-c` flag. By default, all template cached at `$HOME/.dulu`.

```shell
dulu create github:ta7sudan/multicmd-cli demo -c
```



## Show available predefined template and template cache

```shell
dulu ls
```

or

```shell
dulu ls -t
```

or

```shell
dulu ls -c
```



## Clear template cache

You can clear a template cache such as multicmd-cli like this.

```shell
dulu clear multicmd-cli
```

or clear all caches.

```shell
dulu clear -a
```



## More Options

```shell
dulu -h
```

or

```shell
dulu <subcommand> -h
```


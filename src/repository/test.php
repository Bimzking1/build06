<div class="tourc">
		<?php if(is_home() && !is_custom_page()) {?>
			<div class="tourt">
				<i class="glyphicon glyphicon-search"></i> <b><?php echo $oketheme['t_caritour']; ?></b>
			</div><br />
		<?php } ?>
		<div class="tourcs">
			<b><?php echo $oketheme['translate']=='id'?"Pilih Kategori":"Choose Category";?></b>
		</div>
		<div class="tourcs">
			<b><?php echo $oketheme['translate']=='id'?"Pilih Destinasi":"Choose Destination";?></b>
		</div>
		<div class="tourcs">
			<b><?php echo $oketheme['translate']=='id'?"Pilih Durasi":"Choose Duration";?></b>
		</div>
		<form method="post" action="<?php bloginfo('url'); ?>/tour-search-result/">
			<?php $taxonomies = get_object_taxonomies('tour');
				foreach ($taxonomies as $tax) {
					echo buildSelect($tax);
				}
			?><button type="submit" class="ibtn"><i class="glyphicon glyphicon-search"></i> <?=$oketheme['translate']=='id'?"Cari":"Search";?></button>
		</form>
	</div>